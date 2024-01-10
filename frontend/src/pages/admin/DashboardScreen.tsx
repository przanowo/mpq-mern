import { useGetDashboardDataQuery } from '../../slices/productApiSlice'

const DashboardScreen = () => {
  const { data, error, isLoading } = useGetDashboardDataQuery({})

  console.log(data, 'data')

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.toString()}</div>

  const {
    totalQuantity,
    totalPrice,
    giftCategoryData,
    miniaturesCategoryData,
    parfumCategoryData,
    sampleCategoryData,
    soapandpowderCategoryData,
    goldCategoryData,
  } = data as {
    totalQuantity: number
    totalPrice: number
    giftCategoryData: { totalQuantity: number; totalPrice: number }
    miniaturesCategoryData: { totalQuantity: number; totalPrice: number }
    parfumCategoryData: { totalQuantity: number; totalPrice: number }
    sampleCategoryData: { totalQuantity: number; totalPrice: number }
    soapandpowderCategoryData: { totalQuantity: number; totalPrice: number }
    goldCategoryData: { totalQuantity: number; totalPrice: number }
  }

  return (
    <table className='mt-24 w-full shadow-lg border-collapse'>
      <thead className='bg-gray-100 text-left'>
        <tr>
          <th className='px-4 py-2 border-b text-sm font-semibold'>Category</th>
          <th className='px-4 py-2 border-b text-sm font-semibold'>
            Total Quantity
          </th>
          <th className='px-4 py-2 border-b text-sm font-semibold'>
            Total Price Value (€)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className='hover:bg-gray-50'>
          <td className='px-4 py-2 border-b'>All Products</td>
          <td className='px-4 py-2 border-b'>{totalQuantity}</td>
          <td className='px-4 py-2 border-b'>{totalPrice} €</td>
        </tr>
        {/* Repeat for each category */}
        {Object.entries({
          Gifts: giftCategoryData,
          Miniatures: miniaturesCategoryData,
          Parfums: parfumCategoryData,
          Samples: sampleCategoryData,
          'Soaps & Powders': soapandpowderCategoryData,
          Gold: goldCategoryData,
        }).map(([categoryName, categoryData]) => (
          <tr className='hover:bg-gray-50' key={categoryName}>
            <td className='px-4 py-2 border-b'>{categoryName}</td>
            <td className='px-4 py-2 border-b'>{categoryData.totalQuantity}</td>
            <td className='px-4 py-2 border-b'>{categoryData.totalPrice} €</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DashboardScreen
