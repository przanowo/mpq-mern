import React, { useEffect, useState } from 'react';
import { useGetDashboardDataQuery } from '../../slices/productApiSlice';

const DashboardScreen = () => {
  const { data, error, isLoading } = useGetDashboardDataQuery({});

  console.log(data, 'data');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;

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
    totalProducts: number;
    totalPrices: number;
    giftCategoryProducts: number;
    giftCategoryPrices: number;
    miniaturesCategoryProducts: number;
    miniaturesCategoryPrices: number;
    parfumCategoryProducts: number;
    parfumCategoryPrices: number;
    sampleCategoryProducts: number;
    sampleCategoryPrices: number;
    soapandpowderCategoryProducts: number;
    soapandpowderCategoryPrices: number;
    goldCategoryProducts: number;
    goldCategoryPrices: number;
  };

  return (
    <table className='mt-24'>
      <thead>
        <tr>
          <th>Dashboard</th>
          <th>Total Products Number</th>
          <th>Total Price Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>All Products</td>
          <td>{totalProducts}</td>
          <td>{totalPrices} €</td>
        </tr>
        <tr>
          <td>Gifts</td>
          <td>{giftCategoryProducts}</td>
          <td>{giftCategoryPrices} €</td>
        </tr>
        <tr>
          <td>Miniatures</td>
          <td>{miniaturesCategoryProducts}</td>
          <td>{miniaturesCategoryPrices} €</td>
        </tr>
        <tr>
          <td>Parfums</td>
          <td>{parfumCategoryProducts}</td>
          <td>{parfumCategoryPrices} €</td>
        </tr>
        <tr>
          <td>Samples</td>
          <td>{sampleCategoryProducts}</td>
          <td>{sampleCategoryPrices} €</td>
        </tr>
        <tr>
          <td>Soaps & Powders</td>
          <td>{soapandpowderCategoryProducts}</td>
          <td>{soapandpowderCategoryPrices} €</td>
        </tr>
        <tr>
          <td>Gold</td>
          <td>{goldCategoryProducts}</td>
          <td>{goldCategoryPrices} €</td>
        </tr>
      </tbody>
    </table>
  );
};

export default DashboardScreen;
