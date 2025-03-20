import React from 'react'
import loading from "../../assets/loading.gif"
import style from "./Loading.module.css"
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
const Loading: React.FC = () => {
    const isLoading = useSelector((state: RootState) => state.loading.isLoading)

    if (isLoading) {
        return (
            <div className={style.bgLoading}>
                <img src={loading} alt='loading' />
            </div>
        )
    } else {
        return null
    }
}

export default Loading
