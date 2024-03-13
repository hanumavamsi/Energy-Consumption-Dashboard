import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import Icon from '../../images/icon-01.svg';
import EditMenu from '../../components/DropdownEditMenu';
import { createClient } from '@supabase/supabase-js';
// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';
import { data } from 'autoprefixer';

const supabaseUrl = 'https://vwcfcolevwybenzpqdnx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Y2Zjb2xldnd5YmVuenBxZG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzMzY4NjIsImV4cCI6MjAyNTkxMjg2Mn0.Jy3hww4MkUZuQpOOM0Fln-miQLZV4R_gnfnWjYYuPuA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

let avgConsumptionData = 0;

function DashboardCard01() {

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
      .select('date, total_units') // Only select the date and total_units columns
      .order('date', { ascending: true });
      // console.log('test11', elecConsum);


      if (error) {
        console.log('error', error);
        setIsLoading(false); // Stop loading in case of error
      } else {
        // Transform each date from 'YYYY-MM-DD' to 'MM-DD-YYYY'
        const labels = elecConsum.map((item) => {
          const [year, month, day] = item.date.split('-');
          return `${month}-${day}-${year}`;
        });
        const sales = elecConsum.map((item) => item.total_units);
        
        avgConsumptionData = sumObjectValues(sales)/sales.length;

        console.log(avgConsumptionData);

        // console.log(typeof(sales));

        setChartData({
          labels,
          datasets: [
            {
              data: sales,
              fill: true,
              backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.08)`,
              borderColor: tailwindConfig().theme.colors.indigo[500],
              borderWidth: 2,
              tension: 0,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
              pointHoverBackgroundColor: tailwindConfig().theme.colors.indigo[500],
              pointBorderWidth: 0,
              pointHoverBorderWidth: 0,
              clip: 20,
            },
            // Add your second dataset here if needed
          ],
        });
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

  console.log(chartData);
  
  return (
    <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-12 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <img src={Icon} width="32" height="32" alt="Icon 01" />
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" to="#0">
                Option 1
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 flex py-1 px-3" to="#0">
                Option 2
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3" to="#0">
                Remove
              </Link>
            </li>
          </EditMenu>
        </header>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">NITK CAMPUS</h2>
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">Average Electricity Consumption per month</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">{avgConsumptionData.toFixed(3)} KWH</div>
          {/* <div className="text-sm font-semibold text-white px-1.5 bg-emerald-500 rounded-full">+49%</div> */}
        </div>
      </div>
      <div className="grow">
  {isLoading ? (
    <div>Loading...</div> // Placeholder for loading indicator
  ) : (
    <LineChart data={chartData} width={windowWidth} height={128} x = {true} />
  )}
</div>
    </div>
  );
}

export default DashboardCard01;