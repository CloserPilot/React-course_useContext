import Header from './components/Header.jsx';
import Shop from './components/Shop.jsx';
import Product from './components/Product.jsx';
import { DUMMY_PRODUCTS } from './dummy-products.js';

//Se importa el Context necesario
import CartContextProvider from './store/shopping-cart-context.jsx';

function App() {
  return (
    <CartContextProvider>
    {/* Wrap para usar el Context*/}
    
      <Header/>
      <Shop>
         {/* Component Composition, extrayendo la info y pasandola como hijo para evitar props drilling */}
        {DUMMY_PRODUCTS.map((product) => (
            <li key={product.id}>
              <Product {...product} />
            </li>
        ))}
      </Shop>
    </CartContextProvider>
  );
}

export default App;
