import _ from 'underscore';
import { Products } from '../imports/api/products';

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

export function upsertProduct(productID, supplierName, email, status) {
    var selector = { _id: productID };
    var modifier = {
        $set: {
            supplierName: supplierName,
            email: email,
            status: status
        }
    };
    if (Meteor.isServer) {
        var fileUpsert = Products.upsert(selector, modifier);
    }
    return fileUpsert;
}

export function upsertProductInfo(productID, name, category, manufacturer, modelNo, partNo, price, status) {
    var selector = { _id: productID };
    var modifier = {
        $set: {
            name: name,
            category: category,
            manufacturer: manufacturer,
            modelNo: modelNo,
            partNo: partNo,
            price: price,
            status: status
        }
    };
    if (Meteor.isServer) {
        var fileUpsert = Products.upsert(selector, modifier);
    }
    return fileUpsert;
}

export function sendEmail(toEmail, toName, messageBody, fromEmail, fromName) {
    var status = '';
    var secretKey = Meteor.settings.SENDGRID_API_KEY;
    console.info('secretKey', secretKey);
    var authorize = "Bearer " + secretKey;
    HTTP.call("POST", "https://api.sendgrid.com/v3/mail/send", {
        data: {
            "personalizations": [
                {
                    "to": [
                        {
                            "email": toEmail,
                            "name": toName
                        }
                    ],
                    "bcc": [
                        {
                            "email": fromEmail,
                            "name": fromName
                        }
                    ],
                    "subject": "YMP Order Request"
                }
            ],
            "from": {
                "email": "admin@ymp.com",
                "name": "YMP Online"
            },
            "reply_to": {
                "email": fromEmail,
                "name": fromName
            },
            "subject": "YMP Order Request",
            "content": [
                {
                    "type": "text/html",
                    "value": messageBody
                }
            ]
        },
        headers: {
            "Authorization": authorize
        }
    }, function (error, response) {
        if (error) {
            status = error;
            console.info('error', error);
        } else {
            status = response;
            console.info('response', response);
        }
    });
    console.info('status', status);
    return status;

}


Meteor.methods({
    upsertProduct,
    upsertProductInfo,
    sendEmail
});