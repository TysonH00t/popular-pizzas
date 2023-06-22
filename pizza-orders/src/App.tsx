import { useState, useEffect } from 'react'
import './App.css'

// For sake of time, I have avoided adding tests for the file or spending too much time on design.

const POPULAR_PIZZA_SIZE = 20;

type Order = {
  toppings: Array<string>;
}

// This function sorts all orders by popularity and returns POPULAR_PIZZA_SIZE amount
const filterOrdersByPopularity = (orders: Array<Order>): Array<any> => {
  let toppingsMap = new Map();

  // Sort through orders and assign add unique order to map, if they exists already increment map.
  // To determine unique orders I am placing all ingredients in a string and then alphabetically sorting them.
  // I understand that this would have issues potentially with toppings that have the same characters, but it works for this
  // Should run in N log N of time due to sort function
  for (let i = 0; i < orders.length; i++) {
    const order: Order = orders[i];
    const toppings: Array<string> = order.toppings;
    let key = toppings[0];
    if (toppings.length > 1) {
      const alphabatizedStringOfToppings: string = toppings.join('').replace(/\s/g, '').split('').sort().join('');
      key = alphabatizedStringOfToppings;
    }
      toppingsMap.set(key, toppingsMap.has(key) ? 
        {toppings, count: toppingsMap.get(key).count + 1} : 
        {toppings, count: 1});
  }

  // The toppings are sorted, greatest to least
  const sortedToppings = [...toppingsMap.entries()].sort((a, b) => b[1].count - a[1].count);
  // We only keep POPULAR_PIZZA_SIZE amount of toppings to display
  const popularToppings = sortedToppings.slice(0, POPULAR_PIZZA_SIZE).map((order) => order[1]);
  return popularToppings;
}

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://files.olo.com/pizzas.json')
    .then((res) => res.json())
    .then((res) => {
      const popularToppings = filterOrdersByPopularity(res);
      setOrders(popularToppings);
    })
    .catch((err) => console.log(`It appears we have had an error. Specifically: ${err}`));
  }, []);

  return (
    <>
    <section className='top-pizza-section'>
      <h1>Top Selling Pizzas</h1>
      <ol className='pizza-card-list'>
        {orders.map((order, index) => {
          return (
          <li className='pizza-card-list-item' key={index.toString() + order.count.toString()}>
              <h3 aria-label={`${order.count} pizzas sold!`}>{order.count} 🍕 Sold!</h3>
              <ul>
                <h4>Toppings</h4>
                {order.toppings.map((topping, index) => {
                  return (
                    <li key={order.count.toString() + topping + index.toString()}>
                      {topping}
                    </li>
                  )
                })}
              </ul>
          </li>
          );
        })}
      </ol>
    </section>
    </>
  )
}

export default App
