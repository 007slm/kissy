describe('selectable', function() {
	var S = KISSY, D = S.DOM, E = S.Event,
		tempList, VALUE_KEY = 'ks-data',
		SELECTED_ITEM_CLS = 'selected';

	function arrayEqualDOM(array, domArray) {
		if (array.length != domArray.length) {
			return false;
		} 

		for (var i=0, len = array.length; i<len; i++) {
			if (array[i] != domArray[i]) {
				return false;			
			}
		}

		return true;
	}

	beforeEach(function() {
		//����ǰ�ȴ���һ��ģ���list��
		tempList = D.create('<ul id="KS_List"><li ks-filter="true" ks-data = "list1">list1</li><li ks-filter="true" ks-data = "list2">list2</li><li ks-filter="true" ks-data = "list3">list3</li><li ks-data = "list4">list4</li><li ks-data = "list5">list5</li></ul>');
		document.body.appendChild(tempList);
	});

	afterEach(function() {
		//������Ϻ�����ڵ�ɾ��
		D.remove( tempList );
	});

	/**
	 * init ��fire������û���
	 */
	describe('��ʼ������', function() {
		var testList
		beforeEach(function() {
			testList = new S.Selectable('#KS_List',{
				valueKey : VALUE_KEY,
				selectedItemCls : SELECTED_ITEM_CLS
			});
		});

		afterEach(function() {
			testList = null;
		});	

		//���Գ�ʼ��ֵ�Ƿ���ȷ,_parseMarkup��_buildValueMap����û�е�������
		it('���Գ�ʼ������', function() {
			testList.on('init', function() {
				alert('');
			});

			expect( testList ).not.toBeNull();
			expect( testList.container ).toEqual( tempList );
			expect( arrayEqualDOM(testList.items, tempList.children) ).toEqual( true );
			expect( testList.config.valueKey ).toEqual( VALUE_KEY );
			expect( testList.config.selectedItemCls ).toEqual( SELECTED_ITEM_CLS );
			expect( testList.selectedIndex ).toEqual( undefined );
			expect( testList.valueMap ).not.toBeNull();
		});		
	});

	/**
	 * ����select����
	 */
	describe('select����', function() {
		var testList;
		beforeEach(function() {
			testList = new S.Selectable('#KS_List',{
				valueKey : VALUE_KEY,
				selectedItemCls : SELECTED_ITEM_CLS
			});
		});

		afterEach(function() {
			testList = null;
		});	

		it('����Ϊ������ʱ��Ӧ����ȷѡ�ж�Ӧitem���¼�����', function() {
			var index = 1, config = testList.config, 
				item = testList.select(index), fired = false;

			testList.on('select', function() {
				fired = true;
			});

			testList.select(index);

			//��ǰѡ�����dom��ѡ������һ����
			expect( item ).toEqual( tempList.children[index] );
			//��ǰѡ��ֵ�ѱ���Ϊindex
			expect( testList.selectedIndex ).toEqual( index );
			//dom�ڵ��class�����Ѿ����ı�Ϊselected
			expect( D.hasClass(tempList.children[index], config.selectedItemCls) ).toEqual( true );			
			//select�¼�����
			expect( fired ).toEqual( true );

		});

		it('����Ϊ0ʱ��ѡ�е�һ��item���¼�����', function() {
			var index = 0, config = testList.config, 
				item = testList.select(index), fired = false;

			testList.on('select', function() {
				fired = true;
			});

			testList.select(index);

			//��ǰѡ�����dom��ѡ������һ����
			expect( item ).toEqual( tempList.children[index] );
			//��ǰѡ��ֵ�ѱ���Ϊindex
			expect( testList.selectedIndex ).toEqual( index );
			//dom�ڵ��class�����Ѿ����ı�Ϊselected
			expect( D.hasClass(tempList.children[index], config.selectedItemCls) ).toEqual( true );			
			//select�¼�����
			expect( fired ).toEqual( true );
		});

		it('����Ϊundefined����ѡ�κ�item���������¼�', function() {
			var index, config = testList.config, 
				item = testList.select(index), fired = false;

			testList.on('select', function() {
				fired = true;
			});

			testList.select(index);

			//ѡ����Ϊundefined
			expect( item ).toEqual( undefined );
			//selectedIndex����Ϊundefined
			expect( testList.selectedIndex ).toEqual( undefined );
			//��dom�ڵ���û��ѡ�еĽڵ�
			expect( D.hasClass(tempList.children[index], config.selectedItemCls) ).toEqual( false );						
			//�¼�������
			expect( fired ).toEqual( false );
		});

		it('����Ϊnull����ѡ�κ�item���������¼�', function() {
			var index = null, config = testList.config, 
				item = testList.select(index), fired = false;

			testList.on('select', function() {
				fired = true;
			});

			testList.select(index);

			//ѡ����Ϊundefined
			expect( item ).toEqual( undefined );
			//selectedIndex����Ϊundefined
			expect( testList.selectedIndex ).toEqual( undefined );
			//��dom�ڵ���û��ѡ�еĽڵ�
			expect( D.hasClass(tempList.children[index], config.selectedItemCls) ).toEqual( false );						
			//�¼�������
			expect( fired ).toEqual( false );
		});

		it('����Ϊ����ʱ����ѡ�κ�item���������¼�', function() {
			var index = {}, config = testList.config, 
				item, fired = false;

			testList.on('select', function() {
				fired = true;
			});

			item = testList.select(index);

			//ѡ����Ϊundefined
			expect( item ).toEqual( undefined );
			//selectedIndex����Ϊundefined
			expect( testList.selectedIndex ).toEqual( undefined );
			//��dom�ڵ���û��ѡ�еĽڵ�
			expect( D.hasClass(tempList.children[index], config.selectedItemCls) ).toEqual( false );						
			//�¼�������
			expect( fired ).toEqual( false );
		});
	});

	/** 
	 * ����selectByValue����
	 */
	describe('selectByValue����', function() {
		var testList;
		beforeEach(function() {
			testList = new S.Selectable('#KS_List',{
				valueKey : VALUE_KEY,
				selectedItemCls : SELECTED_ITEM_CLS
			});
		});

		afterEach(function() {
			testList = null;
		});	
		
		it('���������list�����е��ַ���Ӧ����ȷѡ�У��¼�����', function() {
			var value = 'list2', fired = false, config = testList.config,
				item;

			testList.on( 'selectByValue', function() {
				fired = true;
			});
			
			testList.selectByValue( value );
			

			selectedIndex = testList.selectedIndex;
			item = D.get( '.' + config.selectedItemCls );

			//��ѡ��ʱselectedIndex����undefined
			expect( selectedIndex ).toNotEqual( undefined );
			//��ѡ��ʱ��dom���ж�Ӧ�Ľڵ����selected class����
			expect( D.hasClass(tempList.children[selectedIndex], config.selectedItemCls) ).toEqual( true );
			//��ѡ��ʱ��ѡ�еĽڵ��value�ʹ����valueӦ��һ��
			expect( D.attr(item, config.valueKey)).toEqual( value );
			//selectByValue�¼�����
			expect( fired ).toEqual( true );
		});

		it('���������list��û�е��ַ�����ѡ���κ�item���������¼�', function() {
			var value = 'list555', fired = false, config = testList.config,
				item;

			testList.on( 'selectByValue', function() {
				fired = true;
			});
			
			testList.selectByValue( value );

			selectedIndex = testList.selectedIndex;
			item = D.get( '.' + config.selectedItemCls );

			//��ѡ��ʱselectedIndex��undefined
			expect( selectedIndex ).toEqual( undefined );
			//dom���в����ں���selectedItmeCls class�Ķ��ڵ�
			expect( item ).toEqual( undefined );
			//selectByValue�¼�������
			expect( fired ).toEqual( false );
		});

		it('��������ǿ��ַ��ַ�����ѡ���κ�item���������¼�', function() {
			var value = '', fired = false, config = testList.config,
				item;

			testList.on( 'selectByValue', function() {
				fired = true;
			});
			
			testList.selectByValue( value );

			selectedIndex = testList.selectedIndex;
			item = D.get( '.' + config.selectedItemCls );

			//��ѡ��ʱselectedIndex��undefined
			expect( selectedIndex ).toEqual( undefined );
			//dom���в����ں���selectedItmeCls class�Ķ��ڵ�
			expect( item ).toEqual( undefined );
			//selectByValue�¼�������
			expect( fired ).toEqual( false );
		});

		it('���������undefined����ѡ���κ�item���������¼�', function() {
			var value = undefined, fired = false, config = testList.config,
				item;

			testList.on( 'selectByValue', function() {
				fired = true;
			});
			
			testList.selectByValue( value );

			selectedIndex = testList.selectedIndex;
			item = D.get( '.' + config.selectedItemCls );

			//��ѡ��ʱselectedIndex��undefined
			expect( selectedIndex ).toEqual( undefined );
			//dom���в����ں���selectedItmeCls class�Ķ��ڵ�
			expect( item ).toEqual( undefined );
			//selectByValue�¼�������
			expect( fired ).toEqual( false );
		});

		it('���������null����ѡ���κ�item���������¼�', function() {
			var value = null, fired = false, config = testList.config,
				item;

			testList.on( 'selectByValue', function() {
				fired = true;
			});
			
			testList.selectByValue( value );

			selectedIndex = testList.selectedIndex;
			item = D.get( '.' + config.selectedItemCls );

			//��ѡ��ʱselectedIndex��undefined
			expect( selectedIndex ).toEqual( undefined );
			//dom���в����ں���selectedItmeCls class�Ķ��ڵ�
			expect( item ).toEqual( undefined );
			//selectByValue�¼�������
			expect( fired ).toEqual( false );
		});

		it('��������Ƕ��󣬲�ѡ���κ�item���������¼�', function() {
			var value = {}, fired = false, config = testList.config,
				item;

			testList.on( 'selectByValue', function() {
				fired = true;
			});
			
			testList.selectByValue( value );

			selectedIndex = testList.selectedIndex;
			item = D.get( '.' + config.selectedItemCls );

			//��ѡ��ʱselectedIndex��undefined
			expect( selectedIndex ).toEqual( undefined );
			//dom���в����ں���selectedItmeCls class�Ķ��ڵ�
			expect( item ).toEqual( undefined );
			//selectByValue�¼�������
			expect( fired ).toEqual( false );
		});
	});


	/**
	 * ����prev����
	 */
	describe('prev����', function() {
		var testList;
		beforeEach(function() {
			testList = new S.Selectable('#KS_List',{
				valueKey : VALUE_KEY,
				selectedItemCls : SELECTED_ITEM_CLS
			});
		});

		afterEach(function() {
			testList = null;
		});	

		it('��ǰѡ��Ϊ��3��ʱ����ȷѡ�е�2��¼�����', function() {
			var index = 3, config = testList.config, fired = false,
				currrentIndex, items, currentItem, currentDOMItem;	
			
			testList.on('prev', function() {
				fired = true;
			});
			testList.select(index);
			testList.prev();

			currentIndex = testList.selectedIndex;
			items = testList.items;
			currentDOMItem = D.get('.' + config.selectedItemCls);
			currentItem = items[currentIndex];
		
			//prev�¼�����
			expect( fired ).toEqual( true );
			//��ǰѡ����Ӧ���ǵ�ǰ���ǰһ��
			expect( currentIndex ).toEqual( 2 );
			//����selectedItemCls��dom�ڵ�Ӧ�ú�selecteable�е�ѡ�нڵ�һ��
			expect( currentDOMItem ).toEqual( currentItem );
		});

		it('��ǰѡ��Ϊ��1��ʱ��ѡ�����һ��¼�����', function() {
			var index = 0, config = testList.config, fired = false,
				currrentIndex, items, currentItem, currentDOMItem;	
			
			testList.on('prev', function() {
				fired = true;
			});
			testList.select(index);
			testList.prev();

			currentIndex = testList.selectedIndex;
			items = testList.items;
			currentDOMItem = D.get('.' + config.selectedItemCls);
			currentItem = items[currentIndex];
		
			//prev�¼�����
			expect( fired ).toEqual( true );
			//��ǰѡ����Ӧ�������һ��
			expect( currentIndex ).toEqual( items.length - 1 );
			//����selectedItemCls��dom�ڵ�Ӧ�ú�selecteable�е�ѡ�нڵ�һ��
			expect( currentDOMItem ).toEqual( currentItem );
		});

		it('��ǰ��ѡ����ʱ��ѡ�����һ��¼�����', function() {
			var index = 0, config = testList.config, fired = false,
				currrentIndex, items, currentItem, currentDOMItem;	
			
			testList.on('prev', function() {
				fired = true;
			});

			testList.prev();

			currentIndex = testList.selectedIndex;
			items = testList.items;
			currentDOMItem = D.get('.' + config.selectedItemCls);
			currentItem = items[currentIndex];
		
			//prev�¼�����
			expect( fired ).toEqual( true );
			//��ǰѡ����Ӧ�������һ��
			expect( currentIndex ).toEqual( items.length - 1 );
			//����selectedItemCls��dom�ڵ�Ӧ�ú�selecteable�е�ѡ�нڵ�һ��
			expect( currentDOMItem ).toEqual( currentItem );
		});
	});

	/**
	 * ����next����
	 */
	describe('next����', function() {
		var testList;
		beforeEach(function() {
			testList = new S.Selectable('#KS_List',{
				valueKey : VALUE_KEY,
				selectedItemCls : SELECTED_ITEM_CLS
			});
		});

		afterEach(function() {
			testList = null;
		});	

		it('��ǰѡ��Ϊ��2��ʱ����ȷѡ�е�3��¼�����', function() {
			var index = 2, config = testList.config, fired = false,
				currrentIndex, items, currentItem, currentDOMItem;	
			
			testList.on('next', function() {
				fired = true;
			});
			testList.select(index);
			testList.next();

			currentIndex = testList.selectedIndex;
			items = testList.items;
			currentDOMItem = D.get('.' + config.selectedItemCls);
			currentItem = items[currentIndex];
		
			//next�¼�����
			expect( fired ).toEqual( true );
			//��ǰѡ����Ӧ���Ǻ�һ��
			expect( currentIndex ).toEqual( 3 );
			//����selectedItemCls��dom�ڵ�Ӧ�ú�selecteable�е�ѡ�нڵ�һ��
			expect( currentDOMItem ).toEqual( currentItem );
		});

		it('��ǰѡ��Ϊ��1��ʱ��ѡ�е�һ��¼�����', function() {
			var index = tempList.children.length, config = testList.config, fired = false,
				currrentIndex, items, currentItem, currentDOMItem;	
			
			testList.on('next', function() {
				fired = true;
			});
			testList.select(index);
			testList.next();

			currentIndex = testList.selectedIndex;
			items = testList.items;
			currentDOMItem = D.get('.' + config.selectedItemCls);
			currentItem = items[currentIndex];
		
			//next�¼�����
			expect( fired ).toEqual( true );
			//��ǰѡ����Ӧ���ǵ�һ��
			expect( currentIndex ).toEqual( 0 );
			//����selectedItemCls��dom�ڵ�Ӧ�ú�selecteable�е�ѡ�нڵ�һ��
			expect( currentDOMItem ).toEqual( currentItem );
		});

		it('��ǰ��ѡ����ʱ��ѡ�е�һ��¼�����', function() {
			var index = 0, config = testList.config, fired = false,
				currrentIndex, items, currentItem, currentDOMItem;	
			
			testList.on('next', function() {
				fired = true;
			});

			testList.next();

			currentIndex = testList.selectedIndex;
			items = testList.items;
			currentDOMItem = D.get('.' + config.selectedItemCls);
			currentItem = items[currentIndex];
		
			//next�¼�����
			expect( fired ).toEqual( true );
			//��ǰѡ����Ӧ���ǵ�һ��
			expect( currentIndex ).toEqual( 0 );
			//����selectedItemCls��dom�ڵ�Ӧ�ú�selecteable�е�ѡ�нڵ�һ��
			expect( currentDOMItem ).toEqual( currentItem );
		});
	});

	/**
	 * ����value
	 */
	describe('value����', function() {
		var testList;
		beforeEach(function() {
			testList = new S.Selectable('#KS_List',{
				valueKey : VALUE_KEY,
				selectedItemCls : SELECTED_ITEM_CLS
			});
		});

		afterEach(function() {
			testList = null;
		});	

		it('��ǰѡ��Ϊ��3��ʱ����ȷ����ֵ��û���¼�����', function() {
			var index = 2, config = testList.config, fired = false,
				currrentIndex, currentDOMItem, reValue;	
			

			testList.select(index);
			reValue = testList.value();			
			currentDOMItem = D.get('.' + config.selectedItemCls);

			//����ֵӦ�ú͵�ǰDOM����ѡ�����data����һ��
			expect( reValue ).toEqual( D.attr(currentDOMItem, config.valueKey) );
		});

		it('��ǰû��ѡ��,����undefined��û���¼�����', function() {
			var index = 2, config = testList.config, fired = false,
				currrentIndex, currentDOMItem, reValue;	
			
			reValue = testList.value();			
			
			//����ֵӦ����undefined
			expect( reValue ).toEqual( undefined );
		});
	});

	/**
	 * ����item
	 */
	describe('item����', function() {
		var testList;
		beforeEach(function() {
			testList = new S.Selectable('#KS_List',{
				valueKey : VALUE_KEY,
				selectedItemCls : SELECTED_ITEM_CLS
			});
		});

		afterEach(function() {
			testList = null;
		});	

		it('��ǰѡ��Ϊ��3��ʱ����ȷ���ض�Ӧitem��û���¼�����', function() {
			var index = 2, config = testList.config, fired = false,
				currrentIndex, currentDOMItem, currentItem;	
			
			testList.select(index);
			currentItem = testList.item();			
			currentDOMItem = D.get('.' + config.selectedItemCls);

			//��ǰѡ�е�itemӦ�ú�DOM����class���Ժ���selectedItemCls�Ľڵ�һ��
			expect( currentItem ).toEqual( currentDOMItem );
		});

		it('��ǰû��ѡ�����undefined��û���¼�����', function() {
			var index = 2, config = testList.config, fired = false,
				currrentIndex, currentDOMItem, currentItem;	

			currentItem = testList.item();			
			currentDOMItem = D.get('.' + config.selectedItemCls);

			//��ǰѡ�е�itemӦ�ú�DOM����class���Ժ���selectedItemCls�Ľڵ�һ��
			expect( currentItem ).toEqual( undefined );
		});
	});

	/**
	 * ����filter
	 */
	describe('filter����', function() {
		var testList;
		beforeEach(function() {
			testList = new S.Selectable('#KS_List',{
				valueKey : VALUE_KEY,
				selectedItemCls : SELECTED_ITEM_CLS
			});
		});

		afterEach(function() {
			testList = null;
		});
		
		it('��������filter����������filter���¼�����', function() {
			var config = testList.config, fired = false,
				filterItems, DOMItems = [];	
			
			testList.on('filter', function() {
				fired = true;
			});		
			
			filterItems = testList.filter(function( list ) {
				if (D.attr( list, 'ks-filter' ) == 'true') {
					return true;
				} else {
					return false;
				}
			});
			
			var listItem;
			for(var i=0, len = tempList.children.length; i<len; i++){
				listItem = tempList.children[i];
				if (D.attr( listItem, 'ks-filter') == 'true') {
					DOMItems.push( listItem );
				}
			}

			//filter�¼�����
			expect( fired ).toEqual( true );
			//����filter���itemӦ�ú�fullItems�����
			expect( filterItems ).toNotEqual( testList.fullItems );
			//filter�󷵻ص�arrayӦ�ú�selectable�����items���
			expect( filterItems ).toEqual( testList.items );
			//filter�󷵻ص�arrayӦ�ú�DOM������filter�Ľڵ����
			expect( filterItems ).toEqual( DOMItems );
		});

		it('����Ƿ���(�ն���)������undefined����filter���������¼�', function() {
			var config = testList.config, fired = false,
				filterItems, DOMItems = [];	
			
			testList.on('filter', function() {
				fired = true;
			});		
			
			filterItems = testList.filter({});

			//filter�¼�������
			expect( fired ).toEqual( false );
			//����ֵӦ����undefined
			expect( filterItems ).toEqual( undefined );
			//selectable�е�itemsӦ�ú�fullItemsһ����û��filter����
			expect( testList.items ).toEqual( testList.fullItems );
		});

		it('����Ƿ���(null)������undefined����filter���������¼�', function() {
			var config = testList.config, fired = false,
				filterItems, DOMItems = [];	
			
			testList.on('filter', function() {
				fired = true;
			});		
			
			filterItems = testList.filter(null);

			//filter�¼�������
			expect( fired ).toEqual( false );
			//����ֵӦ����undefined
			expect( filterItems ).toEqual( undefined );
			//selectable�е�itemsӦ�ú�fullItemsһ����û��filter����
			expect( testList.items ).toEqual( testList.fullItems );
		});
	});

	/**
	 * ����clearFilter,clearFilter������������ζ�Ҫfire clearFilter�¼���
	 */
	describe('clearFilter����', function() {
		var testList;
		beforeEach(function() {
			testList = new S.Selectable('#KS_List',{
				valueKey : VALUE_KEY,
				selectedItemCls : SELECTED_ITEM_CLS
			});
		});

		afterEach(function() {
			testList = null;
		});

		it('��filter�����clearFilter�����filter���¼�����', function() {
			var config = testList.config, fired = false,
				filterItems, DOMItems = [];	
			
			testList.on('clearFilter', function() {
				fired = true;
			});		
			
			filterItems = testList.filter(function(list) {
				if (D.attr( list, 'ks-filter' ) == 'true') {
					return true;
				} else {
					return false;
				}				
			});	
			testList.clearFilter();

			//clearFilter�¼�����
			expect( fired ).toEqual( true );
			//selectable�е�itemsӦ�ú�fullItemsһ��
			expect( testList.items ).toEqual( testList.fullItems );	
			//fullItemsӦ�ú�DOM��childrenһ��
			expect( arrayEqualDOM(testList.fullItems, tempList.children) ).toEqual( true );
		});

		it('����filterʱ����clearFilter�����filter���¼�����', function() {
			var config = testList.config, fired = false,
				filterItems, DOMItems = [];	
			
			testList.on('clearFilter', function() {
				fired = true;
			});		
			
			testList.clearFilter();

			//clearFilter�¼�����
			expect( fired ).toEqual( true );
			//selectable�е�itemsӦ�ú�fullItemsһ��
			expect( testList.items ).toEqual( testList.fullItems );	
			//fullItemsӦ�ú�DOM��childrenһ��
			expect( arrayEqualDOM(testList.fullItems, tempList.children) ).toEqual( true );
		});
	});
});




















































