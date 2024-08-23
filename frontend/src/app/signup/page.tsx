import Link from 'next/link'
import styles from '../page.module.scss'
import { api } from '@/services/api'
import { redirect } from 'next/navigation'

export default function Signup() {
    async function handleRegister(formData: FormData) {
        'use server'
        const name = formData.get('name')
        const email = formData.get('email')
        const password = formData.get('password')

        if (name === '' || email === '' || password === '') return

        try {
            await api.post('/user', {
                name: name,
                email: email,
                password: password,
                status: 'ativo',
            })
        } catch (error) {
            console.log('error')
            console.log(error)
        }

        redirect('/')
    }

    return (
        <>
            <div className={styles.containerCenter}>
                <section className={styles.login}>
                    <h1 className={styles.text}>Criando sua conta</h1>
                    <form action={handleRegister}>
                        <input
                            type="text"
                            required
                            name="name"
                            placeholder="Digite seu nome..."
                            className={styles.input}
                        />
                        <input
                            type="email"
                            required
                            name="email"
                            placeholder="Digite seu email..."
                            className={styles.input}
                        />
                        <input
                            type="password"
                            required
                            name="password"
                            placeholder="Digite sua senha..."
                            className={styles.input}
                        />
                        <button type="submit">Cadastrar</button>
                    </form>

                    <Link href="/" className={styles.text}>
                        Já possui uma conta? Faça seu login!
                    </Link>
                </section>
            </div>
        </>
    )
}
