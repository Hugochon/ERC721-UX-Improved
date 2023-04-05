import React from "react";
import styles from '../styles/contact.module.css'
import Header from './header'
import { useState , useEffect} from "react"

export default function Contact(){

    const [startPosition, setStartPosition] = useState(0);
    const [endPosition, setEndPosition] = useState(0);
    const [mouseDelta, setMouseDelta] = useState(0);

    const [isDragging, setIsDragging] = useState(false);

    const maxDelta = window.innerWidth/2;

    const [color, setColor] = useState('red');


    const handleOnMouseDown = (event) => {

        setStartPosition(event.clientX);
        setIsDragging(true);
        console.log(event.clientX);
        color=='blue' ? setColor('red'):setColor('blue');
        let item = document.querySelector(`.${styles.myElement}`);

        item.style.setProperty('--my-variable', color);
    };

    const handleOnMouseMove = (event) => {
        if (isDragging) {
            const percentage = (event.clientX - startPosition) / maxDelta * 100;
            setMouseDelta(percentage);
            console.log(event.clientX - startPosition);
            console.log("mouse Delta : " + mouseDelta);
            let item = document.querySelector(`.${styles.myElement}`);
            item.style.setProperty('--translationX', percentage/10+'%');
        }
    };

    const handleOnMouseUp = (event) => {
        setEndPosition(event.clientX);
        setIsDragging(false);
        console.log(event.clientX);
        console.log("endPos : " + endPosition);
    };



  return (

    <div className={styles.container}>
            
        <div className={styles.header}>
            <Header />
        </div>
        
        <div className={styles.myElement} onMouseDown={handleOnMouseDown} onMouseMove={handleOnMouseMove} onMouseUp={handleOnMouseUp}>
            <h2 className={styles.title} draggable="false">Contact Page</h2>
            <p><u>Name</u> : Hugo SCHNEEGANS</p>
            <p><u>Mail</u> : hugo.schneegans@gmail.com</p>
        </div>
    </div>

  );
}