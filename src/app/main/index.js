import BasketSimple from '../../components/basket-simple'
import List from '../../components/list'
import Layout from '../../components/layout'
import React, { useCallback, useEffect } from 'react'
import Item from '../../components/item'
import useStore from '../../utils/use-store'
import useSelector from '../../utils/use-selector'
import Pagination from '../../components/pagination'

function Main() {
  console.log('Main')

  const store = useStore()

  useEffect(() => {
    store.get('catalog').load()
  }, [])

  const select = useSelector((state) => ({
    items: state.catalog.items,
    count: state.catalog.count,
    limit: state.catalog.limit,
    // currentPage: state.catalog.currentPage,
    amount: state.basket.amount,
    sum: state.basket.sum,
  }))
  console.log(select.count, select.limit)

  const callbacks = {
    // Открытие корзины
    openModalBasket: useCallback(() => store.get('modals').open('basket'), []),
    // Добавление в корзину
    addToBasket: useCallback((_id) => store.get('basket').addToBasket(_id), []),
    changeNumber: useCallback((skip) => store.get('catalog').load(skip), []),
  }

  const renders = {
    item: useCallback((item) => <Item item={item} onAdd={callbacks.addToBasket} />, []),
  }

  return (
    <Layout head={<h1>Магазин</h1>}>
      <BasketSimple onOpen={callbacks.openModalBasket} amount={select.amount} sum={select.sum} />
      <List items={select.items} renderItem={renders.item} />
      <Pagination limit={select.limit} count={select.count} changeNumber={callbacks.changeNumber} />
    </Layout>
  )
}

export default React.memo(Main)
