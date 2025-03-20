import React from 'react'
import background from '../assets/images/b2.jpg'
import { RouteProps } from 'react-router-dom';
import './HomeTemplate.css'
type HomeTemplateProps = RouteProps & {
    WrappedComponent: React.ComponentType<any>;
}

const HomeTemplate: React.FC<HomeTemplateProps> = ({ WrappedComponent, ...restProps }) => {
    return (
        <div className='container-template' style={{ backgroundImage: `url(${background})` }}>
            <WrappedComponent {...restProps} />
        </div>
    )
}

export default HomeTemplate
