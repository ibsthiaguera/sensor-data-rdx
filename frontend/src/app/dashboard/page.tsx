'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './styles.module.scss'
import { RefreshCw } from 'lucide-react'
import Chart from 'chart.js/auto'

import { api } from '@/services/api'
import { getCookieClient } from '@/lib/cookieClient'

interface SensorData {
    id: number
    equipment_id: string
    timestamp: string
    value: number
}

interface Equipment {
    id: string
    name: string
    media: number
    sensor_data: SensorData[]
}

export default function Dashboard() {
    const [equipments, setEquipments] = useState<Equipment[]>([])
    const [selectedEquipment, setSelectedEquipment] =
        useState<Equipment | null>(null)
    const token = getCookieClient()
    const chartRef = useRef<HTMLCanvasElement | null>(null)
    const chartInstanceRef = useRef<Chart | null>(null)

    // Função para buscar os equipamentos e seus dados de sensores
    const fetchEquipments = async () => {
        try {
            const response = await api.get<Equipment[]>('/equipment', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setEquipments(response.data)
            
            if (response.data.length > 0) {
                setSelectedEquipment(response.data[0]) // Seleciona o primeiro equipamento por padrão
            }
        } catch (error) {
            console.error('Erro ao buscar dados dos equipamentos:', error)
        }
    }

    useEffect(() => {
        fetchEquipments()
    }, [])

    // Atualizar gráfico com dados dos sensores do equipamento selecionado
    useEffect(() => {
        if (
            selectedEquipment &&
            selectedEquipment.sensor_data.length > 0 &&
            chartRef.current
        ) {
            const ctx = chartRef.current.getContext('2d')
    
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy() // Destroi gráfico anterior antes de criar novo
            }
    
            if (ctx) {
                // Extrair valores dos sensores e filtrar valores nulos/undefined
                const sensorValues = selectedEquipment.sensor_data
                    .map((data) => Number(data.value))
                    .filter((value) => value !== null && value !== undefined)
    
                // Calcular a média acumulada dinâmica
                const mediaValues = sensorValues.map((_, index, array) => {
                    const slice = array.slice(0, index + 1)
                    const sum = slice.reduce((a, b) => a + b, 0)
                    return sum / slice.length
                })
    
                chartInstanceRef.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: selectedEquipment.sensor_data.map((data) =>
                            new Date(data.timestamp).toLocaleString()
                        ),
                        datasets: [
                            {
                                label: 'Valor',
                                data: selectedEquipment.sensor_data.map((data) => data.value),
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                fill: false,
                                cubicInterpolationMode: 'monotone',
                                tension: 0.4
                            },
                            {
                                label: 'Média',
                                data: mediaValues,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                fill: false,
                                cubicInterpolationMode: 'monotone',
                                tension: 0.4
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Data / Horário',
                                },
                            },
                            y: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Valor',
                                },
                            },
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: selectedEquipment.id,
                            },
                        },
                    },
                })
            }
        }
    }, [selectedEquipment])

    return (
        <main className={styles.container}>
            <section className={styles.containerHeader}>
                <h1>Equipamentos</h1>
            </section>

            <section className={styles.listData}>
                {equipments.map((equipment) => (
                    <div key={equipment.id}>
                        <div
                            className={styles.equipment}
                            onClick={() => setSelectedEquipment(equipment)}
                        >
                            <div className={styles.tag}></div>
                            <span>{equipment.id}</span>
                        </div>
                    </div>
                ))}
            </section>

            <section className={styles.chartContainer}>
                {selectedEquipment ? (
                    <canvas ref={chartRef} />
                ) : (
                    <p>Selecione um equipamento para ver os dados do sensor.</p>
                )}
            </section>
        </main>
    )
}
