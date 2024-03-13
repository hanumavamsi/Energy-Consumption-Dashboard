import LineChart from '../../charts/LineChart02';
import randomColor from 'randomcolor';
// Import utilities
import { tailwindConfig } from '../../utils/Utils';


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../images/icon-01.svg';
import EditMenu from '../../components/DropdownEditMenu';
import { createClient } from '@supabase/supabase-js';
// Import utilities
import { data } from 'autoprefixer';


const supabaseUrl = 'https://vwcfcolevwybenzpqdnx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Y2Zjb2xldnd5YmVuenBxZG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzY4NjIsImV4cCI6MjAyNTkxMjg2Mn0.Jy3hww4MkUZuQpOOM0Fln-miQLZV4R_gnfnWjYYuPuA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


function DashboardCard08() {

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      let { data: elecConsum, error } = await supabase
      .from('elec_consumption')
      .select('date, solar, mescom') // Only select the date and total_units columns
      .order('date', { ascending: true });
      // console.log('test11', elecConsum);
      console.log('testelec', elecConsum)


      if (error) {
        console.log('error', error);
        setIsLoading(false); // Stop loading in case of error
      } else {
        // Transform each date from 'YYYY-MM-DD' to 'MM-DD-YYYY'

        const dataByYear = {};

        elecConsum.forEach(item => {
          const year = item.date.substring(0, 4);

          // If the year is not already in dataByYear, create an array for it
          if (!dataByYear[year]) {
              dataByYear[year] = [];
          }
      
          // Push the item to the array corresponding to the year
          dataByYear[year].push(item);
        })

        const labels = elecConsum.map((item) => {
          const [year, month, day] = item.date.split('-');
          return `${day}-${month}-${year}`;
        });
        // // console.log(typeof(sales));
        // console.log(mescom)
        // console.log(solar)
        console.log('testlabel', labels)

        const yearsList = Object.keys(dataByYear).sort();

        const arrayOfObjects = [];
        
        Object.keys(dataByYear).forEach(year => {
          const yearData = dataByYear[year];

          const arr = [];

          yearData.forEach(item => {
            arr.push(item.solar);
          })

          // console.log('testyear', yearData);

          let rng = 300 + Math.random()*1000;

          const obj = {
              label: year,
              data: arr, 
              borderColor: randomColor(),
              fill: false,
              borderWidth: 2,
              tension: 0,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor:  randomColor(),
              pointHoverBackgroundColor:  randomColor(),
              pointBorderWidth: 0,
              pointHoverBorderWidth: 0,
              clip: 20,
          };
          
          // Push the object to the arrayOfObjects array
          arrayOfObjects.push(obj);
      });
        
        // console.log('testonbjarr', arrayOfObjects)

        setChartData({
          labels : ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
          datasets: arrayOfObjects,
        });
        console.log('TestchartData', chartData);
        setIsLoading(false); // Stop loading
      }
    };
    
    fetchData();
  }, []);


  return (
    <div className="flex flex-col col-span-full sm:col-span-12 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100"> Solar Energy Consumption over years</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      {isLoading ?  (
        <div> Is Loading...</div>
      ): (
        <LineChart data={chartData} width={window.innerWidth} height={248} x={true} />  
      ) }
    </div>
  );
}

export default DashboardCard08;
