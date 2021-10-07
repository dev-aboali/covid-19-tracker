import React, {useEffect, useState} from 'react'
import { Card, CardContent, Typography} from '@material-ui/core'
import './InfoBox.css';
import CountUp from 'react-countup';


const InfoBox = ({ title, cases, active, total, isRed, ...props }) => {
    const [mounted, setMounted]= useState(false)
    useEffect(() => {
        setMounted(true)
    },[])
    return (
        
        <Card onClick={props.onClick} className={` infoBox ${active && 'infoBox--selected'} ${isRed && 'infobox--red'}`}>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>
                    
                    {mounted && cases &&  (
                        <CountUp start={0} end={cases} delay={1} duration={5} separator=","
                        />
                        
                    )}
                    
                </h2>
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
