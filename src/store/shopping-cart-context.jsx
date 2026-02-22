import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

//Plantilla del Context
export const CartContext = createContext({
  items: [],
  addItemToCart: () => { },
  updateItemQuantity: () => { }
});

//Se agrega afuera por que no necesita recrearse cada vez que se llama al JSX de abajo
function shoppingCartReducer(state, action) {
  if (action.type === 'ADD_ITEM') {
    const updatedItems = [...state.items];
    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload.id
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find((product) => {
       return product.id === action.payload.id
      }
      );
      updatedItems.push({
        id: action.payload.id,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state, //Not needed por que solo se usa 1 valor
      items: updatedItems,
    };
  }

  if (action.type === 'UPDATE_ITEM') {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  return state;
}


//Funcion que se usa como wraper para no tener tanto contenido en la App()
export default function CartContextProvider({ children }) {

  //Se utiliza para reducir el codigo repetitivo
  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    //Se pasa el apuntador hacia la funcion del reducer y el valor inicial que deberia tener
    shoppingCartReducer,
    { items: [], }
  );

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: 'ADD_ITEM',
      payload: {
        id
      }
    });

  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: 'UPDATE_ITEM',
      payload: {
        productId,
        amount
      }
    })
  }

  //Se crea un objeto para tener la informacion del carrito y la funcion que puede actualizarlo
  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity
  };


  return (
    <CartContext.Provider value={ctxValue}>
      {children}
    </CartContext.Provider >
  )
}