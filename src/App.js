import React,{ useEffect, useState} from 'react'
import './App.css'
import { 
    Select,
    FormControl,
    MenuItem,
    Card,
    CardContent
} from '@material-ui/core';
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import { sortData, prettyPrintStat } from './util'
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import numeral from 'numeral';
const App = () => {
    const [country, setCountry] = useState('worldwide')
    const [countries, setCountries] = useState([])
    const [countryInfo, setCountryInfo] = useState({})
    const [tableData, setTableData] = useState([])
    const [casesType, setCasesType] = useState("cases");
    const [mapCountries, setMapCountries] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
    const [mapZoom, setMapZoom] = useState(3);
    
    useEffect( () => {
        const getCountryInfo = async () => {
            await fetch('https://disease.sh/v3/covid-19/all')
            .then(res => res.json())
            .then( data => {
                setCountryInfo(data)
            });
        }
        getCountryInfo()
    }, [])
    useEffect(() => {
        const getCountriesData = async () => {
            await fetch('https://disease.sh/v3/covid-19/countries')
            .then(res => res.json())
            .then(data => {
                const countries = data.map(country => (
                    {
                        name:  country.country,
                        value: country.countryInfo.iso2
                    }
                ));
                // setTableData(data);
                const sortedData = sortData(data)
                setTableData(sortedData)
                setCountries(countries);
                setMapCountries(data)
            })

        }
        getCountriesData()
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value

        const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}` ;
        await fetch(url)
            .then(res => res.json())
            .then(data => {
                setCountry(countryCode);
                setCountryInfo(data);
                setMapCenter([ data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4)
            }) 
            
    }
    
    return (

        <div className="app">
            <div className="app__left">
                <div className="app__header">
                    <h1>Covid-19 Tracker</h1>
                    <FormControl className="app__dropmenu">
                        <Select 
                            variant="outlined"
                            value={country}
                            onChange={onCountryChange}
                            >
                                <MenuItem value="worldwide">Worldwide</MenuItem>
                                {
                                    countries.map( country => (
                                        <MenuItem value={country.value}>{country.name}</MenuItem>
                                    ))
                                }
                                
                        </Select>
                    </FormControl>
                </div>
            
                    { countryInfo.cases && (
                        <div className="app__stats">
                        <InfoBox 
                        isRed
                        active= {casesType === "cases"}
                        onClick={ (e) => setCasesType('cases')} 
                        title="Coronavirus Cases"  
                        cases={prettyPrintStat(countryInfo.todayCases)} 
                        total={numeral(countryInfo.cases).format("0.0a")}
                      />
                    <InfoBox 
                        onClick={ e => setCasesType('recovered')} 
                        title="Recovered" 
                        cases={prettyPrintStat(countryInfo.todayRecovered)} 
                        total={numeral(countryInfo.recovered).format("0.0a")} 
                        active= {casesType === "recovered"}
                        />
                    <InfoBox
                        isRed 
                        onClick={ e => setCasesType('deaths')} 
                        title="Deaths" 
                        cases={prettyPrintStat(countryInfo.todayDeaths)} 
                        total={numeral(countryInfo.deaths).format("0.0a")} 
                        active= {casesType === "deaths"}
                        
                        />
                     </div>
                    )}
                    
               
                <Map 
                    countries={mapCountries} 
                    center={mapCenter} 
                    zoom={mapZoom} 
                    casesType={casesType}
                />
            </div>
            <Card className="app__right">
                <CardContent>
                    
                    <h3>Live Cases By Country</h3>
                    <Table countries={tableData} />
                    <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
                    <LineGraph className="app__graph" casesType={casesType} />

                </CardContent>
            </Card>
           
        </div>
    );
}

export default App;