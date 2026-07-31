import { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { motion } from 'framer-motion'

import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi'

import { useAuth } from '../../context/AuthContext'

import { toast } from 'react-toastify'

import { Spinner } from '../../components/common/Loaders'



export default function AdminLogin() {

  const [form, setForm] = useState({ email: '', password: '' })

  const [showPass, setShowPass] = useState(false)

  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState({})

  const { login, logout } = useAuth()

  const navigate = useNavigate()



  const validate = () => {

    const e = {}

    if (!form.email) e.email = 'Email is required'

    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'

    if (!form.password) e.password = 'Password is required'

    setErrors(e)

    return !Object.keys(e).length

  }



  const handleSubmit = async (ev) => {

    ev.preventDefault()

    if (!validate()) return

    setLoading(true)



    try {

      // 1. Authenticate using your existing login function

      const userData = await login(form.email, form.password)

      

      // 2. Verify if the account has admin privileges

      const userRoles = userData?.roles || userData?.role || []

      const isAdmin = Array.isArray(userRoles) 

        ? userRoles.includes('ROLE_ADMIN') || userRoles.includes('ADMIN')

        : userRoles === 'ROLE_ADMIN' || userRoles === 'ADMIN'



      if (isAdmin) {

        toast.success('Welcome to Admin Portal!')

        navigate('/admin/dashboard') // Change to your preferred admin route

      } else {

        // If not an admin, log them out instantly and block access

        await logout()

        toast.error('Access Denied: Admin credentials required.')

      }

    } catch (err) {

      const errorMsg = 

        typeof err.response?.data === 'string' 

          ? err.response.data 

          : err.response?.data?.message || err.response?.data?.error || 'Invalid admin credentials.'

      

      toast.error(errorMsg, {

        position: "top-right",

        autoClose: 4000,

        hideProgressBar: false,

        closeOnClick: true,

        pauseOnHover: true,

        draggable: true,

      })

    } finally {

      setLoading(false)

    }

  }



  return (

    <div style={{ minHeight: '100vh', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px' }}>

      <div style={{ position: 'absolute', top: '20%', left: '15%', width: 300, height: 300, background: 'rgba(0, 242, 254, 0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />



      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}

        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        <div className="glass" style={{ borderRadius: 24, padding: 40, border: '1px solid rgba(0, 242, 254, 0.2)' }}>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>

            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>

              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>

                <FiShield size={20} />

              </div>

              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#00F2FE' }}>ADMIN PORTAL</span>

            </Link>

            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 6 }}>Restricted Access</h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in with administrator credentials</p>

          </div>



          <form onSubmit={handleSubmit}>

            <div className="mm-form-group">

              <label className="mm-label"><FiMail size={13} /> Admin Email</label>

              <input

                type="email"

                className="mm-input"

                placeholder="admin@movemate.com"

                value={form.email}

                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}

              />

              {errors.email && <span className="mm-error">{errors.email}</span>}

            </div>



            <div className="mm-form-group">

              <label className="mm-label"><FiLock size={13} /> Password</label>

              <div style={{ position: 'relative' }}>

                <input

                  type={showPass ? 'text' : 'password'}

                  className="mm-input"

                  placeholder="Admin password"

                  value={form.password}

                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}

                  style={{ paddingRight: 44 }}

                />

                <button type="button" onClick={() => setShowPass(!showPass)}

                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>

                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}

                </button>

              </div>

              {errors.password && <span className="mm-error">{errors.password}</span>}

            </div>



            <button type="submit" className="btn-primary-mm" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 12, background: 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)' }} disabled={loading}>

              {loading ? <Spinner size={18} color="#fff" /> : <><FiShield size={16} /> Admin Sign In</>}

            </button>

          </form>



          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.85rem' }}>

            Back to <Link to="/login" style={{ color: '#00F2FE', fontWeight: 600 }}>Regular Sign in</Link>

          </p>

        </div>

      </motion.div>

    </div>

  )

}