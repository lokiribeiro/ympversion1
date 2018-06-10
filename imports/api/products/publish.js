import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Products } from './collection';

if (Meteor.isServer) {
    Meteor.publish('products', function (options, searchString, supplierID) {
        var selector = { supplierID: supplierID };

        if (typeof searchString === 'string' && searchString.length) {
            //selector.name = {
            //  $regex: `.*${searchString}.*`,
            //  $options : 'i'
            var search = { $regex: `.*${searchString}.*`, $options: 'i' };
            selector = {
                $and: [
                    { supplierID: supplierID },
                    {
                        $or: [
                            { name: search },
                            { category: search },
                            { manufacturer: search },
                            { modelNo: search },
                            { partNo: search },
                            { price: search }
                        ]
                    }
                ]
            };
        }

        Counts.publish(this, 'numberOfProducts', Products.find(selector), {
            noReady: true
        });

        return Products.find(selector, options);
    });

    Meteor.publish('productsList', function (options, name, category, manufacturer, modelNo, partNo, supplierName, minPrice, maxPrice) {
        var status = 'true';
        var selector = {status: status};
        if ((typeof minPrice === 'string' && minPrice.length) && (typeof maxPrice === 'string' && maxPrice.length)) {
            var searchMinPrice = parseFloat(minPrice);
            var searchMaxPrice = parseFloat(maxPrice);
            console.info('pasok both min', searchMinPrice);
            console.info('pasok both max', searchMaxPrice)

            //if (typeof name === 'string' && name.length) {
            //selector.name = {
            //  $regex: `.*${searchString}.*`,
            //  $options : 'i'
            var searchName = { $regex: `.*${name}.*`, $options: 'i' };
            var searchCategory = { $regex: `.*${category}.*`, $options: 'i' };
            var searchManufacturer = { $regex: `.*${manufacturer}.*`, $options: 'i' };
            var searchModelNo = { $regex: `.*${modelNo}.*`, $options: 'i' };
            var searchPartNo = { $regex: `.*${partNo}.*`, $options: 'i' };
            var searchSupplierName = { $regex: `.*${supplierName}.*`, $options: 'i' };
            selector = {
                $and: [
                    {
                        price: {
                            $gte: searchMinPrice,
                            $lte: searchMaxPrice
                        }
                    },
                    { name: searchName },
                    { category: searchCategory },
                    { manufacturer: searchManufacturer },
                    { modelNo: searchModelNo },
                    { partNo: searchPartNo },
                    {status: status}
                ]
            };
            //}
        } else if (typeof maxPrice === 'string' && maxPrice.length) {
            var searchMaxPrice = parseFloat(maxPrice);
            console.info('pasok max', searchMaxPrice);
            //if (typeof name === 'string' && name.length) {
            //selector.name = {
            //  $regex: `.*${searchString}.*`,
            //  $options : 'i'
            var searchName = { $regex: `.*${name}.*`, $options: 'i' };
            var searchCategory = { $regex: `.*${category}.*`, $options: 'i' };
            var searchManufacturer = { $regex: `.*${manufacturer}.*`, $options: 'i' };
            var searchModelNo = { $regex: `.*${modelNo}.*`, $options: 'i' };
            var searchPartNo = { $regex: `.*${partNo}.*`, $options: 'i' };
            var searchSupplierName = { $regex: `.*${supplierName}.*`, $options: 'i' };
            selector = {
                $and: [
                    {
                        price: {
                            $lte: searchMaxPrice
                        }
                    },
                    { name: searchName },
                    { category: searchCategory },
                    { manufacturer: searchManufacturer },
                    { modelNo: searchModelNo },
                    { partNo: searchPartNo },
                    {status: status}
                ]
            };
            //}
        } else if (typeof minPrice === 'string' && minPrice.length) {
            var searchMinPrice = parseFloat(minPrice);
            console.info('pasok min', searchMinPrice);
            //if (typeof name === 'string' && name.length) {
            //selector.name = {
            //  $regex: `.*${searchString}.*`,
            //  $options : 'i'
            var searchName = { $regex: `.*${name}.*`, $options: 'i' };
            var searchCategory = { $regex: `.*${category}.*`, $options: 'i' };
            var searchManufacturer = { $regex: `.*${manufacturer}.*`, $options: 'i' };
            var searchModelNo = { $regex: `.*${modelNo}.*`, $options: 'i' };
            var searchPartNo = { $regex: `.*${partNo}.*`, $options: 'i' };
            var searchSupplierName = { $regex: `.*${supplierName}.*`, $options: 'i' };
            selector = {
                $and: [
                    {
                        price: {
                            $gte: searchMinPrice
                        }
                    },
                    { name: searchName },
                    { category: searchCategory },
                    { manufacturer: searchManufacturer },
                    { modelNo: searchModelNo },
                    { partNo: searchPartNo },
                    {status: status}
                ]
            };
            //}
        } else {
            var searchName = { $regex: `.*${name}.*`, $options: 'i' };
            var searchCategory = { $regex: `.*${category}.*`, $options: 'i' };
            var searchManufacturer = { $regex: `.*${manufacturer}.*`, $options: 'i' };
            var searchModelNo = { $regex: `.*${modelNo}.*`, $options: 'i' };
            var searchPartNo = { $regex: `.*${partNo}.*`, $options: 'i' };
            var searchSupplierName = { $regex: `.*${supplierName}.*`, $options: 'i' };
            selector = {
                $and: [
                    { name: searchName },
                    { category: searchCategory },
                    { manufacturer: searchManufacturer },
                    { modelNo: searchModelNo },
                    { partNo: searchPartNo },
                    { supplierName: searchSupplierName },
                    {status: status}
                ]
            };
        }



        Counts.publish(this, 'numberOfProductsList', Products.find(selector), {
            noReady: true
        });

        return Products.find(selector, options);
    });

    Meteor.publish('productList', function (options) {
        var selector = {};

        return Products.find(selector);
    });
}