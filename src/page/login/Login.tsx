import React, { useState } from 'react'
import style from './style.module.css'
import tick from '../../assets/images/tick.png'
import { useFormik } from 'formik'
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { loginUser } from '../../redux/slice/userSlice';
import { message } from 'antd';
import { NavLink, useHistory } from 'react-router-dom';
import { displayLoading, hideLoading } from '../../redux/slice/loadingSlice';
const Login: React.FC = () => {
    const history = useHistory()
    const dispatch = useDispatch<AppDispatch>()
    const [messageApi, contextHolder] = message.useMessage();
    const [loginError, setLoginError] = useState<string | null>(null);
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
            password: Yup.string().required("Mật khẩu không được để trống"),
        }),
        onSubmit: async (values) => {
            try {
                dispatch(displayLoading())
                setLoginError(null);
                const response = await dispatch(loginUser({
                    email: values.email,
                    password: values.password
                }))

                if (loginUser.rejected.match(response)) {
                    setLoginError("Sai tài khoản hoặc mật khẩu!");
                    return;
                }
                localStorage.setItem("user", JSON.stringify(response));
                messageApi.success("Register successfully!");
                setTimeout(() => {
                    history.push("/listemployee");
                }, 500);


            } catch (error) {
                messageApi.error("Failed to login!");
            } finally {
                dispatch(hideLoading())
            }
        },
    })
    return (
        <div style={{ width: '45%' }}>
            {contextHolder}
            <div className={style.w3layoutscontaineragileits}>
                <h2>Login </h2>
                <form onSubmit={formik.handleSubmit}>
                    <input style={{ color: 'white' }} type="email" name="email" placeholder="EMAIL" required value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    <div style={{ color: "red", fontSize: "14px", display: "block", minHeight: "20px" }}>
                        {formik.touched.email && formik.errors.email && <span>{formik.errors.email}</span>}
                    </div>


                    <input style={{ color: 'white' }} type="password" name="password" placeholder="PASSWORD" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} required />
                    <div style={{ color: "red", fontSize: "14px", display: "block", minHeight: "20px" }}>
                        {formik.touched.password && formik.errors.password && <div style={{ color: "red" }}>{formik.errors.password}</div>}
                    </div>

                    {loginError && <div style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>{loginError}</div>}

                    <ul className={style.agileinfotickwthree}>
                        <li>
                            <input style={{ background: `url: ${tick}` }} type="checkbox" id="brand1" />
                            <label htmlFor="brand1"><span />Remember me</label>
                            <NavLink to="#">Forgot password?</NavLink>
                        </li>
                    </ul>
                    <div className={style.aitssendbuttonw3ls}>
                        <input type="submit" defaultValue="LOGIN" />
                        <p style={{ color: 'white' }}> To register new account <span>→</span> <NavLink className="w3_play_icon1" to="/register"> Click Here</NavLink></p>
                        <div className="clear" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
