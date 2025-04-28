<div class="card mb-3 shadow">
  <div class="card-body">
    <div class="card-text">

		

		<div class="form-inline mb-2 justify-content-center">
			
			<label>
				<input value="light" checked="" type="radio" name="color">
				<span class="checkmark"></span>
			</label>
			
			<label>
				<input value="pink" type="radio" name="color">
				<span class="checkmark"></span>
			</label>

			<label>
				<input value="red" type="radio" name="color">
				<span class="checkmark"></span>
			</label>

			<label>
				<input value="orange" type="radio" name="color">
				<span class="checkmark"></span>
			</label>

			<label>
				<input value="yellow" type="radio" name="color">
				<span class="checkmark"></span>
			</label>
			
			<label>
				<input value="green"  type="radio" name="color">
				<span class="checkmark"></span>
			</label>

			<label>
				<input value="blue" type="radio" name="color">
				<span class="checkmark"></span>
			</label>
			
			<label>
				<input value="purple" type="radio" name="color">
				<span class="checkmark"></span>
			</label>
			
			
			
		</div>

        <hr>
		<input id="title" type="text" placeholder="Title" class="form-control mb-2">

    	<div contenteditable="true" id="content" class="form-control mb-2" placeholder="What do you have to tell today?" required=""></div>

    	<datalist id="tagList">
    		<option value="Un developer cualquiera"></option>
    		<option value="html" disabled></option>
    		<option value="css"></option>
    		<option value="js"></option>
    	</datalist>
    	<ul id="tag-pills">
    	</ul>
    	<input id="tags" type="text" placeholder="Tags" class="form-control" list="tagList">
    </div>
  </div>
  <div class="card-footer">
  	<button class="btn btn-primary rounded-pill float-right">Publish</button>
  </div>
</div>
