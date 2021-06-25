odoo.define('aspl_delivery_sign.delivery_sign', function (require) {
"use strict";

    var BasicController = require('web.BasicController');
	var rpc = require('web.rpc');
	var FormRenderer = require('web.FormRenderer');
	var FormController = require('web.FormController');
	var core = require('web.core');

	var _t = core._t;

	FormRenderer.include({
		_addOnClickAction: function ($el, node) {
			var self = this;
	        $el.click(function () {
	        	if(node.attrs.name == 'signature_dummy'){
	        		self.trigger_up('sign_button_clicked', {
		                attrs: node.attrs,
		                record: self.state,
		            });
	        	}else{
	        		self.trigger_up('button_clicked', {
		                attrs: node.attrs,
		                record: self.state,
		            });
	        	}
	        });
		},
	});

	FormController.include({
		custom_events: _.extend({}, FormController.prototype.custom_events, {
			sign_button_clicked: '_onSignButtonClicked',
		}),
		_onSignButtonClicked:function(event){
			var self = this;
			self.saveRecord(self.handle, {
                stayInEdit: true,
            }).then(function () {
            	var record = self.model.get(event.data.record.id);
            	self._callSignButtonAction(event.data.attrs, record)
            });
		},
		_callSignButtonAction: function(attrs, record){
			if(attrs.name == 'signature_dummy' && record.model == 'stock.picking'){
	            this.open_signature_popup(record);
	        }
		},
		open_signature_popup: function(record){
			var self = this;
			$('.model-body-sign').empty();
			$('.model-body-sign').html('<canvas id="canvas" width="600px" height="200px"></canvas>');
			var canvas = new fabric.Canvas('canvas');
			if(record.res_id){
				rpc.query({
	                model: 'stock.picking',
	                method: 'search_read',
	                args: [[['id','=',parseInt(record.res_id)]], ['signature','state', 'name']],
	            }, {
	            	async: false
	            }).then(function(result){
	            	if(result && result[0]){
	            		if(result[0].state == "assigned" || result[0].state == "confirmed" || result[0].state == "waiting"){
		            		$('#customerModal').modal('show');
	            		}else{
	            			self.do_notify(_t('Information'),_t("Livraison "+ result[0].name +" est faute!, Tu peux pas ajouter signature."));
	            		}
	            	}
	            });
			}
			canvas.observe('mouse:move', function(o){
				canvas.isDrawingMode = 1;
				canvas.freeDrawingBrush.width = 3;
				canvas.freeDrawingBrush.color = '#4c4c4c';
			});
			canvas.on('mouse:up', function(o){
				canvas.isDrawingMode = 0;
			});
			$('.modal-footer').delegate('.save_sign','click', {'canvas':canvas,'active_id':record.res_id,'self':self}, self.save_sign);
			$('.modal-footer').delegate('.reset_sign','click', {'canvas':canvas}, self.reset_sign);
		},
		save_sign:function(event){
            var self = this;
            event.stopImmediatePropagation()
            var id = event.data.active_id;
            var blank = document.createElement('canvas');
		    blank.width = event.data.canvas.width;
		    blank.height = event.data.canvas.height;
		    if(blank.toDataURL() == event.data.canvas.toDataURL()){
		    	event.data.self.do_warn(_t('SVP ajouter signature et réessayer.'));
		    }else{
                if(id){
                    rpc.query({
		                model: 'stock.picking',
		                method: 'write',
		                args: [parseInt(id),{'signature': event.data.canvas.toDataURL().split('data:image/png;base64,')[1]}],
		            }, {
		            	async: false
		            }).then(function (result) {
		            	if(result){
		            		event.data.self.do_notify(_t('Information'),_t("Signature sauvegader."));
            				event.data.canvas.clear();
            				event.data.canvas.renderAll();
            				$('#customerModal').modal('hide');
            			}else{
            				alert("Signature pas enregistrer.");
            			}
		            });
                }else{
                    alert("Record id n'exsiste pas, svp actualiser la page et réessayer.");
                }
		    }
		    // render form view
		    event.data.self.update({});
        },
	});

});