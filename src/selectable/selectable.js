/**
 * Selectable
 * @creator  ����<qingyu@taobao.com> & ����<boyu@taobao.com>
 */
KISSY.add('selectable', function(S, undefined) {
	
	var DOM = S.DOM, Event = S.Event,
		CLS_PREFIX = 'ks-selectable-', DATA_PREFIX = 'ks-data-',
		NONE_SELECTED_INDEX = -1, DOT = '.',
		EVENT_INIT = 'init', EVENT_SELECT = 'select', EVENT_SELECTBYVALUE = 'selectByValue',
		EVENT_PREV = 'prev', EVENT_NEXT = 'next', EVENT_VALUE = 'value',
		EVENT_ITEM = 'item', EVENT_FILTER = 'filter', 
		EVENT_CLEARFILTER = 'clearFilter';
	
	/**
     * Selectable Widget
     * attached members��
     *   - this.container
     *   - this.config
     *   - this.items  ����Ϊ��ֵ []
     *   - this.length
     *   - this.selectedIndex
     */
	function Selectable(container, config) {
		var self = this;
		
        // ����������Ϣ
        config = config || {};
        if (!('markupType' in config)) {
            if (config.itemCls) {
                config.markupType = 1;
            } else if (config.items) {
                config.markupType = 2;
            }
        }
		config = S.merge(Selectable.Config, config || {});
		
		/**
         * the container of widget
         * @type HTMLElement
         */
		self.container = S.get(container);
		
		/**
         * the current items of widget
         * @type Array
         */
		//self.items;

		/**
		 * the fullItems of widget
		 * @type Array
		 */
		//self.fullItems;

		/**
         * the configration of widget
         * @type Object
         */
		self.config = config;

		/**
         * ��ǰѡ��������ֵ
         * @type Number
         */
		//self.selectedIndex;
		
		/**
         * value-item��map
         * @type Object
         */
		//self.valueMap;

		self._init();
	}
	
	//Ĭ������
	Selectable.Config = {
		// markup ������,ȡֵ���£�
		markupType: 0,
		
		//0 Ĭ�Ϸ�ʽ,ͨ��container��ȡitems;
		
		//1 ��ʽ,ͨ��class��ȡitems;
		itemCls: CLS_PREFIX + 'item',

		//ѡ�е�item��class
		selectedItemCls: CLS_PREFIX + 'selected',

		//����item��class,����������ʹ��display:none
		invisibleItemCls: undefined,
	
		//2 ���ɷ�ʽ,���ɴ���items
		items: [],

		// ��ȡֵ������
		valueKey: DATA_PREFIX + 'value',

		//Ĭ��ѡ��������ֵ
		selectedIndex: undefined,

		//ѡ���Ĭ��display����ֵ
		defaultDisplay: undefined
	};
	
	// ���
    Selectable.Plugins = [];
	
	S.augment(Selectable, S.EventTarget, {
		
		//��ʼ��
		_init: function() {
			var self = this, cfg = self.config;

			self._parseMarkup();
			self._buildValueMap();

			if (cfg.selectedIndex !== undefined) {
				self.select(cfg.selectedIndex);
			}
			if (!cfg.defaultDisplay) {
				cfg.defaultDisplay = DOM.css(self.items[0], 'display');
			}

			self.fire(EVENT_INIT);
		},
		
		//����html,���items
		_parseMarkup: function() {
			var self = this, cfg = self.config,
				container = self.container, items = [];
				
			switch (cfg.markupType) {
				case 0: //Ĭ�Ϸ�ʽ
					items = DOM.children(container);
					break;
				case 1: //��ʽ
					items = S.query(DOT + cfg.itemCls, container);
					break;
				case 2: //���ɷ�ʽ
					items = cfg.items;
			}
			
			self.items = S.makeArray(items);
			self.fullItems = self.items;
		},
		
		//����Value-Item Map
		_buildValueMap: function() {
			var self = this, config = self.config,
				obj = {};
			S.each(self.items, function(item) {
				var value = DOM.attr(item, config.valueKey)
				if (value !== undefined){
					obj[value] = item;
				}
			});
			self.valueMap = obj;
		},
		
		/**
		 * ��������ֵѡ��
		 * @param	index	Number	����ֵ,��Ϊ-1(NONE_SELECTED_INDEX),��ѡ���κ���
		 * @return	HTMLElement	��ǰѡ�е���
		 */
		select: function(index) {
			var item;
			if (this.selectedIndex !== undefined) {
				this._cancelSelectedItem();
			}
			this._setSelectedItem(index);
			item = this.items[this.selectedIndex];
			
			if (item != undefined){
				this.fire(EVENT_SELECT);
			}

			return item;
		},

		//ȡ����ǰѡ����
		_cancelSelectedItem: function() {
			var item = this.items[this.selectedIndex],
				SELECTED_ITEM_CLS = this.config.selectedItemCls;
			DOM.removeClass(item, SELECTED_ITEM_CLS);
			this.selectedIndex = undefined;
		},

		//����ѡ����
		_setSelectedItem: function(index) {
			var item = this.items[index],
				SELECTED_ITEM_CLS = this.config.selectedItemCls;
			if (item) {
				DOM.addClass(item, SELECTED_ITEM_CLS);
				this.selectedIndex = index;
			} else {
				this.selectedIndex = undefined;
			}
		},
		
		//����ֵѡ��
		selectByValue: function(value) {
			var self = this, config = self.config, 
				item = self.valueMap[value];

			if (item) {
				for (var i = 0, len = self.items.length; i < len; i++) {
					if (item === self.items[i]) {
						self.fire(EVENT_SELECTBYVALUE);
						self.select(i);
						break;
					}
				}
			}
		},
		
		//ѡ��ǰһ��
		prev: function() {
			if (this.selectedIndex === undefined) {
				this.selectedIndex = 0;
			}
			this.select(this.selectedIndex > 0 ? this.selectedIndex - 1 : this.items.length - 1);

			this.fire(EVENT_PREV);
		},
		
		//ѡ���һ��
		next: function() {
			if (this.selectedIndex === undefined) {
				this.selectedIndex = this.items.length - 1;
			}
			this.select(this.selectedIndex < this.items.length - 1 ? this.selectedIndex + 1 : 0);

			this.fire(EVENT_NEXT);
		},
		
		//��õ�ǰѡ��ֵ
		value: function() {
			var self = this, item = self.item();
			if (item) {
				return DOM.attr(item, self.config.valueKey);
			}
		},

		//��ȡ��ǰѡ�е�item
		item: function() {
			if (this.selectedIndex !== undefined) {
				return this.items[this.selectedIndex];
			}
		},

		//�����ṩ�ķ�������
		filter: function(fn) {
			var items = this.items, cfg = this.config, filterResult = [],
				INVISIBLE_ITEM_CLS = cfg.invisibleItemCls;
			this.clearFilter();
	
			if (!S.isFunction(fn)) {
				return;
			}
			S.each(items, function(item) {
				//�����ǰ��ѡ��ֵ,���ÿ�ѡ��ֵ
				this.select(NONE_SELECTED_INDEX);
				if (!fn(item, this)) {
					if (INVISIBLE_ITEM_CLS) {
						DOM.addClass(item, INVISIBLE_ITEM_CLS);
					} else {
						DOM.css(item, 'display', 'none');
					}
				} else {
					filterResult.push(item);
				}
			}, this);

			this.items = filterResult;
			
			this.fire(EVENT_FILTER);

			return filterResult;
		},

		clearFilter: function() {
			var cfg = this.config, 
				INVISIBLE_ITEM_CLS = cfg.invisibleItemCls;

			//�����ǰ��ѡ��ֵ,���ÿ�ѡ��ֵ
			this.select(NONE_SELECTED_INDEX);
			this.items = this.fullItems;
			if (INVISIBLE_ITEM_CLS) {
				DOM.removeClass(this.items, INVISIBLE_ITEM_CLS);
			} else {
				DOM.css(this.items, 'display', cfg.defaultDisplay);
			}

			this.fire(EVENT_CLEARFILTER);
		}
		
	});

	S.Selectable = Selectable;

}, { requires: ['core'] });

/**
��־��

2010-10-29	
1. �����Ƿ�ʵ�ֶ�ѡ����ʵ�ֶ�ѡ,�����Χ�Ķ���ǰ�����
	����ʵ�ֶ�ѡ
2. value�����,�Ƿ��ڳ�ʼ��ʱ�γ�һ��value-item��map?

2010-11-1
1.selectable��IE���������Ӧ��

2010-11-3
1.�������ⲿʵ�ֶ�filter��Ľ��cache������comboBox��query���߱�ķ������Ȳ�ѯ��cache�ٵ���filter��
2.fullItems���������޸�
3.���еĲ�����Ҫ�����Զ����¼�
*/
