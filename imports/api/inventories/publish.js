import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Inventories } from './collection';

if (Meteor.isServer) {
  Meteor.publish('inventories', function (options, searchString, boatID) {
    var selector = { boatID: boatID };

    if (typeof searchString === 'string' && searchString.length) {
      //selector.name = {
      //  $regex: `.*${searchString}.*`,
      //  $options : 'i'
      var search = { $regex: `.*${searchString}.*`, $options: 'i' };
      selector = {
        $and: [
          { boatID: boatID },
          {
            $or: [
              { name: search },
              { category: search },
              { manufacturer: search },
              { modelNo: search },
              { partNo: search },
              { totalAmount: search },
              { minAmount: search },
              { department: search },
              { critical: search }
            ]
          }
        ]
      };
    }

    Counts.publish(this, 'numberOfInventories', Inventories.find(selector), {
      noReady: true
    });

    return Inventories.find(selector, options);
  });

  Meteor.publish('inventoriesList', function (options) {
    var selector = {};

    return Inventories.find(selector);
  });

  Meteor.publish('searchinventories', function (options, searchString) {
    var privateItem = 'false';
    var selector = { private: privateItem };

    if (typeof searchString === 'string' && searchString.length) {
      //selector.name = {
      //  $regex: `.*${searchString}.*`,
      //  $options : 'i'
      var search = { $regex: `.*${searchString}.*`, $options: 'i' };
      selector = {
        $and: [
          { private: privateItem },
          {
            $or: [
              { name: search },
              { category: search },
              { manufacturer: search },
              { modelNo: search },
              { partNo: search },
              { price: search },
              { boatName: search }
            ]
          }
        ]
      };
    }

    Counts.publish(this, 'numberOfSearchInventories', Inventories.find(selector), {
      noReady: true
    });

    return Inventories.find(selector, options);
  });
}