/* create instamce of this by

	new QueryList();
*/
function QueryList()
{	
	var _collListItem, _objListItem;
	
	this.retrieveListItems = _retrieveListItems;
	this.insertListItem = _insertListItem;
	this.updateListItem = _updateListItem;
	this.deleteListItem = _deleteListItem;
	this.getListItem = _getListItem;
	this.getCollection = _getCollection;
	this.getCollectionCount = _getCollectionCount;
	
	/* retrieveListItems()
	
	Uses the client side object model to get the site items from a list.
	
	Parameters:
	sList - is the name of the list.
	sQuery - is the CAML query to execute.
	CALLBACK_SUCCESS - is the call back  function to call on sucessful execution.
	CALLBACK_FAIL - is the call back function to call on fail. If not defined, call default.
	
	Example query:
	
	sQuery = '<View> \
			<Query> \
				<Where> \
					<Eq> \
						<FieldRef Name="ContentType"/> \
						<Value Type="Text">Distributed</Value> \
					</Eq> \
				</Where> \
				<OrderBy><FieldRef Name="T_TrackerID"/></OrderBy> \
			</Query> \
		</View>';
	*/
	function _retrieveListItems(sList, sQuery, CALLBACK_SUCCESS, CALLBACK_FAIL)
	{
		var oClientContext, oList, camlQuery
		
		oClientContext = new SP.ClientContext.get_current();
		oList = oClientContext.get_web().get_lists().getByTitle(sList);
		        
		camlQuery = new SP.CamlQuery();
		camlQuery.set_viewXml(sQuery);
		_collListItem = oList.getItems(camlQuery);
		        
		oClientContext.load(_collListItem);
		
		if(CALLBACK_FAIL == undefined)
			oClientContext.executeQueryAsync(CALLBACK_SUCCESS, _requestFailed);
		else
			oClientContext.executeQueryAsync(CALLBACK_SUCCESS, CALLBACK_FAIL);

	}
	
	/* insertListItem()
	
	Insert data into a list item. To get the new ID, call getListItem in success function and call 
	get_id() on the object returned.
	
	Parameters:
	sList - is the name of the list.
	arrFieldValues - is an array of field names and values.
	CALLBACK_SUCCESS - is the call back  function to call on sucessful execution.
	CALLBACK_FAIL - is the call back function to call on fail. If not defined, call default.
	
	Example data array:
	 
			arrFieldValues = [[ "Title", "Test 6"], 
				["DateTest", new Date()],
				["NumberTest", 3.5], 
				["LookupTest", createLookupField(1) ]];

	 */
	function _insertListItem(sList, arrFieldValues, CALLBACK_SUCCESS, CALLBACK_FAIL)
	{
		var oCclientContext, oList, itemCreateInfo;
			
		oClientContext = new SP.ClientContext.get_current();;
		oList = oClientContext.get_web().get_lists().getByTitle(sList);
		itemCreateInfo = new SP.ListItemCreationInformation();
		_objListItem = oList.addItem(itemCreateInfo);	
		
		$(arrFieldValues).each(function(i, v) {
			_objListItem.set_item(v[0], v[1]);
		});
					    
		_objListItem.update();
		
		oClientContext.load(_objListItem);
		    
		if(CALLBACK_FAIL == undefined)
			oClientContext.executeQueryAsync(CALLBACK_SUCCESS, _requestFailed);
		else
			oClientContext.executeQueryAsync(CALLBACK_SUCCESS, CALLBACK_FAIL);

	}
	
	/* updateListItem()
	
	Update a list item.
	
	Parameters:
	sList - is the name of the list.
	iListID - is the list item's ID.
	arrFieldValues - is an array of field names and values.
	CALLBACK_SUCCESS - is the call back  function to call on sucessful execution.
	CALLBACK_FAIL - is the call back function to call on fail. If not defined, call default.

	 */
	function _updateListItem(sList, iListID, arrFieldValues, CALLBACK_SUCCESS, CALLBACK_FAIL)
	{
		var oClientContext, oList, oListItem;
		
	
		oClientContext = new SP.ClientContext.get_current();;
		oList = oClientContext.get_web().get_lists().getByTitle(sList);
		oListItem = oList.getItemById(iListID);
						
		$(arrFieldValues).each(function(i, v) {
			oListItem.set_item(v[0], v[1]);
		});
					    
		oListItem.update();
		
		oClientContext.load(oListItem);
		
		if(CALLBACK_FAIL == undefined)
			oClientContext.executeQueryAsync(CALLBACK_SUCCESS, _requestFailed);
		else
			oClientContext.executeQueryAsync(CALLBACK_SUCCESS, CALLBACK_FAIL);
	}
	
	/* deleteListItem()
	
	Delete List item.
	
	Parameters:
	sList - is the name of the list.
	iListID - is the list item's ID.
	CALLBACK_SUCCESS - is the call back  function to call on sucessful execution.
	CALLBACK_FAIL - is the call back function to call on fail. If not defined, call default.
	
	 */
	function _deleteListItem(sList, iListID, CALLBACK_SUCCESS, CALLBACK_FAIL)
	{
		var oClientContext, oList, oListItem;
		
		oClientContext = new SP.ClientContext.get_current();;
		oList = oClientContext.get_web().get_lists().getByTitle(sList);
		oListItem = oList.getItemById(iListID);
						
		oListItem.deleteObject();
		    
		if(CALLBACK_FAIL == undefined)
			oClientContext.executeQueryAsync(CALLBACK_SUCCESS, _requestFailed);
		else
			oClientContext.executeQueryAsync(CALLBACK_SUCCESS, CALLBACK_FAIL);
	}
	
	/* getListItem()
	
	Return the List Item.
	
	 */
	function _getListItem()
	{
		return _objListItem;
	}
	
	/* requestFailed()
	
	 Default fail function.
	  */
	function _requestFailed(sender, args) 
	{		
	    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
	}
	
	/* getCollection()
	
	Get the collection of list items loaded via retrieveListItems()
	
	 */
	function _getCollection()
	{
		return _collListItem;
	}
	
	/* getCollectionCount()
	
	Get collection count.
	 */
	function _getCollectionCount()
	{
		return _collListItem.get_count();
	}	
}