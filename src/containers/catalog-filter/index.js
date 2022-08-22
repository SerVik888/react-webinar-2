import React, { useCallback, useMemo } from 'react'
import useSelector from '../../hooks/use-selector'
import useStore from '../../hooks/use-store'
import useTranslate from '../../hooks/use-translate'
import Select from '../../components/select'
import Input from '../../components/input'
import LayoutFlex from '../../components/layout-flex'
import useInit from '../../hooks/use-init'
import { sortItem } from '../../utils/sort-item'

function CatalogFilter() {
  const store = useStore()

  useInit(
    async () => {
      await store.get('catalog').getCategories()
    },
    [],
    { backForward: true }
  )

  const select = useSelector((state) => ({
    sort: state.catalog.params.sort,
    query: state.catalog.params.query,
    category: state.catalog.params.category,
    categories: state.catalog.categories,
  }))

  const { t } = useTranslate()

  const callbacks = {
    // Поиск по категориям
    onSearchCategory: useCallback((category) => {
      store.get('catalog').setParams({ category })
      store.get('catalog').resetPage()
    }, []),
    // Сортировка
    onSort: useCallback((sort) => store.get('catalog').setParams({ sort }), []),
    // Поиск
    onSearch: useCallback((query) => store.get('catalog').setParams({ query, page: 1 }), []),
    // Сброс
    onReset: useCallback(() => store.get('catalog').resetParams(), []),
  }

  // Опции для полей
  const options = {
    sort: useMemo(
      () => [
        { value: 'order', title: 'По порядку' },
        { value: 'title.ru', title: 'По именованию' },
        { value: '-price', title: 'Сначала дорогие' },
        { value: 'edition', title: 'Древние' },
      ],
      []
    ),
    categories: useMemo(
      () => [
        { value: '', title: 'Все' },
        ...sortItem(select.categories).map((el) => ({ value: el._id, title: el.title })),
      ],
      [select.categories]
    ),
  }

  return (
    <LayoutFlex flex='start'>
      <Select
        onChange={callbacks.onSearchCategory}
        value={select.category}
        options={options.categories}
      />
      <Select onChange={callbacks.onSort} value={select.sort} options={options.sort} />
      <Input onChange={callbacks.onSearch} value={select.query} placeholder={'Поиск'} theme='big' />
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
    </LayoutFlex>
  )
}

export default React.memo(CatalogFilter)
