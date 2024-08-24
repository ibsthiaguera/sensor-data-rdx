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
    const [selectedPeriod, setSelectedPeriod] = useState('24h')
    const token = getCookieClient()
    const chartRef = useRef<HTMLCanvasElement | null>(null)
    const chartInstanceRef = useRef<Chart | null>(null)

    const fetchEquipments = async () => {
        try {
            const response = await api.get<Equipment[]>('/equipment', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setEquipments(response.data)

            if (response.data.length > 0) {
                setSelectedEquipment(response.data[0])
            }
        } catch (error) {
            console.error('Erro ao buscar dados dos equipamentos:', error)
        }
    }

    useEffect(() => {
        fetchEquipments()
    }, [])

    const formatPeriod = (period: string) => {
        switch (period) {
            case '24h':
                return 'Últimas 24 horas'
            case '48h':
                return 'Últimas 48 horas'
            case 'week':
                return 'Última semana'
            case 'month':
                return 'Último mês'
            default:
                return ''
        }
    }

    const filterDataByPeriod = (sensorData: SensorData[], period: string) => {
        const now = new Date().getTime()

        switch (period) {
            case '24h':
                return sensorData.filter(
                    (data) =>
                        now - new Date(data.timestamp).getTime() <=
                        24 * 60 * 60 * 1000
                )
            case '48h':
                return sensorData.filter(
                    (data) =>
                        now - new Date(data.timestamp).getTime() <=
                        48 * 60 * 60 * 1000
                )
            case 'week':
                return sensorData.filter(
                    (data) =>
                        now - new Date(data.timestamp).getTime() <=
                        7 * 24 * 60 * 60 * 1000
                )
            case 'month':
                return sensorData.filter(
                    (data) =>
                        now - new Date(data.timestamp).getTime() <=
                        30 * 24 * 60 * 60 * 1000
                )
            default:
                return sensorData
        }
    }

    useEffect(() => {
        if (selectedEquipment && chartRef.current) {
            const filteredData = filterDataByPeriod(
                selectedEquipment.sensor_data,
                selectedPeriod
            )
            const ctx = chartRef.current.getContext('2d')

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy()
            }

            if (ctx && filteredData.length > 0) {
                const sensorValues = filteredData.map((data) =>
                    Number(data.value)
                )
                const mediaValues = sensorValues.map((_, index, array) => {
                    const slice = array.slice(0, index + 1)
                    const sum = slice.reduce((a, b) => a + b, 0)
                    return sum / slice.length
                })

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: filteredData.map((data) =>
                            new Date(data.timestamp).toLocaleString()
                        ),
                        datasets: [
                            {
                                label: 'Valor',
                                data: filteredData.map((data) => data.value),
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                cubicInterpolationMode: 'monotone',
                            },
                            {
                                label: 'Média',
                                data: mediaValues,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                cubicInterpolationMode: 'monotone',
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
                                text: `${selectedEquipment.id} - Período: ${formatPeriod(selectedPeriod)}`,
                            },
                        },
                    },
                })
            }
        }
    }, [selectedEquipment, selectedPeriod])

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

            <section className={styles.containerPeriod}>
                <div
                    className={styles.period}
                    onClick={() => setSelectedPeriod('24h')}
                >
                    <span>Últimas 24 horas</span>
                </div>
                <div
                    className={styles.period}
                    onClick={() => setSelectedPeriod('48h')}
                >
                    <span>Últimas 48 horas</span>
                </div>
                <div
                    className={styles.period}
                    onClick={() => setSelectedPeriod('week')}
                >
                    <span>Última semana</span>
                </div>
                <div
                    className={styles.period}
                    onClick={() => setSelectedPeriod('month')}
                >
                    <span>Último mês</span>
                </div>
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
