import { useGetDashboardDataQuery } from '../../slices/productApiSlice'

const DashboardScreen = () => {
  const { data, error, isLoading } = useGetDashboardDataQuery({})

  console.log(data, 'data')

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.toString()}</div>

  const {
    totalProducts,
    totalPrices,
    giftCategoryProducts,
    giftCategoryPrices,
    miniaturesCategoryProducts,
    miniaturesCategoryPrices,
    parfumCategoryProducts,
    parfumCategoryPrices,
    sampleCategoryProducts,
    sampleCategoryPrices,
    soapandpowderCategoryProducts,
    soapandpowderCategoryPrices,
    goldCategoryProducts,
    goldCategoryPrices,
  } = data as {
    totalProducts: number
    totalPrices: number
    giftCategoryProducts: number
    giftCategoryPrices: number
    miniaturesCategoryProducts: number
    miniaturesCategoryPrices: number
    parfumCategoryProducts: number
    parfumCategoryPrices: number
    sampleCategoryProducts: number
    sampleCategoryPrices: number
    soapandpowderCategoryProducts: number
    soapandpowderCategoryPrices: number
    goldCategoryProducts: number
    goldCategoryPrices: number
  }

  return (
    <table className='mt-24 w-full shadow-lg border-collapse'>
      <thead className='bg-gray-100 text-left'>
        <tr>
          <th className='px-4 py-2 border-b text-sm font-semibold'>
            Dashboard
          </th>
          <th className='px-4 py-2 border-b text-sm font-semibold'>
            Total Products Number
          </th>
          <th className='px-4 py-2 border-b text-sm font-semibold'>
            Total Price Value
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className='hover:bg-gray-50'>
          <td className='px-4 py-2 border-b'>All Products</td>
          <td className='px-4 py-2 border-b'>{totalProducts}</td>
          <td className='px-4 py-2 border-b'>{totalPrices} €</td>
        </tr>
        <tr className='hover:bg-gray-50'>
          <td className='px-4 py-2 border-b'>Gifts</td>
          <td className='px-4 py-2 border-b'>{giftCategoryProducts}</td>
          <td className='px-4 py-2 border-b'>{giftCategoryPrices} €</td>
        </tr>
        <tr className='hover:bg-gray-50'>
          <td className='px-4 py-2 border-b'>Miniatures</td>
          <td className='px-4 py-2 border-b'>{miniaturesCategoryProducts}</td>
          <td className='px-4 py-2 border-b'>{miniaturesCategoryPrices} €</td>
        </tr>
        <tr className='hover:bg-gray-50'>
          <td className='px-4 py-2 border-b'>Parfums</td>
          <td className='px-4 py-2 border-b'>{parfumCategoryProducts}</td>
          <td className='px-4 py-2 border-b'>{parfumCategoryPrices} €</td>
        </tr>
        <tr className='hover:bg-gray-50'>
          <td className='px-4 py-2 border-b'>Samples</td>
          <td className='px-4 py-2 border-b'>{sampleCategoryProducts}</td>
          <td className='px-4 py-2 border-b'>{sampleCategoryPrices} €</td>
        </tr>
        <tr className='hover:bg-gray-50'>
          <td className='px-4 py-2 border-b'>Soaps & Powders</td>
          <td className='px-4 py-2 border-b'>
            {soapandpowderCategoryProducts}
          </td>
          <td className='px-4 py-2 border-b'>
            {soapandpowderCategoryPrices} €
          </td>
        </tr>
        <tr className='hover:bg-gray-50'>
          <td className='px-4 py-2 border-b'>Gold</td>
          <td className='px-4 py-2 border-b'>{goldCategoryProducts}</td>
          <td className='px-4 py-2 border-b'>{goldCategoryPrices} €</td>
        </tr>
      </tbody>
    </table>
  )
}

export default DashboardScreen
