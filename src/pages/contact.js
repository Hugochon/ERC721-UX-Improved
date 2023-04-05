import React from "react";
import styles from '../styles/contact.module.css'
import Header from './header'

export default function Contact(){
    return(
        <div className={styles.container}>
            
            <div className={styles.header}>
                <Header />
            </div>
            
            
            <div className={styles.details}>
                <h2 className={styles.title}>Contact Page</h2>
                <p><u>Name</u> : Hugo SCHNEEGANS</p>
                <p><u>Mail</u> : hugo.schneegans@gmail.com</p>
            </div>
        </div>
    )
}