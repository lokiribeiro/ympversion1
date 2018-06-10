import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Suppliers } from './collection';

if (Meteor.isServer) {
  Meteor.publish('suppliers', function (options, searchString) {
    var selector = {};

    if (typeof searchString === 'string' && searchString.length) {
      //selector.name = {
      //  $regex: `.*${searchString}.*`,
      //  $options : 'i'
      var search = { $regex: `.*${searchString}.*`, $options: 'i' };
      selector = {
        $or: [
            {supplierName: search},
            {address: search},
            {email: search},
            {phone: search},
            {status: search}
          ]
      };
    }

    Counts.publish(this, 'numberOfSuppliers', Suppliers.find(selector), {
      noReady: true
    });

    return Suppliers.find(selector, options);
  });
}