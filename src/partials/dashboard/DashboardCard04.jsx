import BarChart from '../../charts/BarChart01';

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



function DashboardCard04() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      let { data: elecConsum, error } = await supabase
      .from('elec_consumption')
      .select('date, solar, mescom') // Only select the date and total_units columns
      .order('date', { ascending: true });
      // console.log('test11', elecConsum);
      console.log(elecConsum)

      if (error) {
        console.log('error', error);
        setIsLoading(false); // Stop loading in case of error
      } else {
        // Transform each date from 'YYYY-MM-DD' to 'MM-DD-YYYY'
        const labels = elecConsum.map((item) => {
          const [year, month, day] = item.date.split('-');
          return `${day}-${month}-${year}`;
        });
        const mescom = elecConsum.map((item) => item.mescom);
        const solar = elecConsum.map((item) => item.solar);
        
        // console.log(typeof(sales));
        console.log(mescom)
        console.log(solar)
        console.log(labels)

        setChartData({
          labels,
          datasets: [
            {
              label: "Solar",
              data: solar,
              backgroundColor: tailwindConfig().theme.colors.blue[400],
              hoverBackgroundColor: tailwindConfig().theme.colors.blue[500],
              barPercentage: 0.66,
              categoryPercentage: 0.66,
            },
            {
              label: "Mescom",
              data: mescom,
              backgroundColor: tailwindConfig().theme.colors.indigo[500],
              hoverBackgroundColor: tailwindConfig().theme.colors.indigo[600],
              barPercentage: 0.66,
              categoryPercentage: 0.66,
            },
          ],
        });

        console.log(chartData);
        setIsLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);



  return (
    <div className="flex flex-col col-span-full sm:col-span-12 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Solar VS MESCOM</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      {isLoading ? (
    <div>Loading...</div> // Placeholder for loading indicator
  ) : (
    <BarChart data={chartData} width={windowWidth} height={200} x= {true} />
    )}
    </div>
  );
}

export default DashboardCard04;
