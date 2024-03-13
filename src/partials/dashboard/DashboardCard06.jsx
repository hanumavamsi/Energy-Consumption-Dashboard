import DoughnutChart from '../../charts/DoughnutChart';
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

let total = 0;
let mescomPercentage =  0;
let solarPercentage = 0;

function DashboardCard06() {

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
        const labels = elecConsum.map((item) => {
          const [year, month, day] = item.date.split('-');
          return `${day}-${month}-${year}`;
        });
        const mescom = sumObjectValues(elecConsum.map((item) => item.mescom));
        const solar = sumObjectValues(elecConsum.map((item) => item.solar));
        total = mescom + solar;
        mescomPercentage = mescom/total*100;
        solarPercentage = 100 - mescomPercentage;
        // // console.log(typeof(sales));
        // console.log(mescom)
        // console.log(solar)
        console.log('testlabel', labels)

        setChartData({
          labels : ['MESCOM', 'Solar'],
          datasets: [
            {
              label: 'Distribution of Electricity',
              data: [mescomPercentage, solarPercentage],
              backgroundColor: [
                    tailwindConfig().theme.colors.red[500],
                    tailwindConfig().theme.colors.blue[400],
                    tailwindConfig().theme.colors.red[700],
                  ],
                  hoverBackgroundColor: [
                    tailwindConfig().theme.colors.red[600],
                    tailwindConfig().theme.colors.blue[500],
                    tailwindConfig().theme.colors.red[900],
                  ],
                  borderWidth: 0,
            },
          ],
        });

        console.log('TestchartData', chartData);
        setIsLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);



  function sumObjectValues(obj) {
    let sum = 0;
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'number') {
          sum += obj[key];
        }
      }
    }
    return sum;
  }

  // const chartData = {
  //   labels: ['United States', 'Italy', 'Other'],
  //   datasets: [
  //     {
  //       label: 'Top Countries',
  //       data: [
  //         35, 30, 35,
  //       ],
  //       backgroundColor: [
  //         tailwindConfig().theme.colors.indigo[500],
  //         tailwindConfig().theme.colors.blue[400],
  //         tailwindConfig().theme.colors.indigo[800],
  //       ],
  //       hoverBackgroundColor: [
  //         tailwindConfig().theme.colors.indigo[600],
  //         tailwindConfig().theme.colors.blue[500],
  //         tailwindConfig().theme.colors.indigo[900],
  //       ],
  //       borderWidth: 0,
  //     },
  //   ],
  // };

  return (
    <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-12 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Energy Distribution</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      {isLoading ? (
    <div>Loading...</div> // Placeholder for loading indicator
  ) : (
    <div>
      <DoughnutChart data={chartData} width={window.innerWidth} height={260} />
      <div className='flex flex-row justify-center items-center'>
        <div className='px-1 '>Mescom : <span className='font-semibold'>{mescomPercentage.toFixed(2)}&#x25;</span> </div>
        <div className='px-1 '>Solar : <span className='font-semibold'>{solarPercentage.toFixed(2)}&#x25;</span> </div>
        </div>
    </div>

    )}
    </div>
  );
}

export default DashboardCard06;
