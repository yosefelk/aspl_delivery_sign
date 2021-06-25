# -*- coding: utf-8 -*-
#################################################################################
# Author      : Acespritech Solutions Pvt. Ltd. (<www.acespritech.com>)
# Copyright(c): 2012-Present Acespritech Solutions Pvt. Ltd.
# All Rights Reserved.
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#################################################################################

{
    'name': 'Delivery Signature',
    'category': 'Stock',
    'summary': 'This module allows user to sign delivery.',
    'description': """
This module allows user to sign delivery.
""",
    'author': 'Acespritech Solutions Pvt. Ltd.',
    'website': 'http://www.acespritech.com',
    'price': 25.00, 
    'currency': 'EUR',
    'version': '1.0.1',
    'depends': ['base','stock'],
    'images': ['static/description/main_screenshot.png'],
    "data": [
        'views/aspl_delivery_sign.xml',
        'views/delivery_config_view.xml',
    ],
    'qweb': ['static/src/xml/delivery_sign.xml'],
    'installable': True,
    'auto_install': False,
}

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
