import Link from 'next/link'
import styles from './page.module.scss'
import { api } from '@/services/api'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function Page() {
    async function handleLogin(formData: FormData) {
        'use server'
        const email = formData.get('email')
        const password = formData.get('password')

        if (email === '' || password === '') return

        try {
            const response = await api.post('/auth', {
                email,
                password,
            })

            if (!response.data.token) return
            const expireTime = 60 * 60 * 24 * 30 * 1000

            cookies().set('session', response.data.token, {
                maxAge: expireTime,
                path: "/",
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production'
            })
        } catch (error) {
            console.log('error')
            console.log(error)
        }

        redirect('/dashboard')
    }
    return (
        <>
            <div className={styles.containerCenter}>
                <section className={styles.login}>
                    <h1 className={styles.text}>Desafio Radix</h1>
                    <form action={handleLogin}>
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
                        <button type="submit">Acessar</button>
                    </form>

                    <Link href="/signup" className={styles.text}>
                        Não possui uma conta? Cadastre-se!
                    </Link>
                </section>
            </div>
        </>
    )
}
