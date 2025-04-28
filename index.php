<?php include "header.php"; ?>

<?php include "inc/menu.php"; ?>


<div class="row justify-content-center" style="margin-top: 80px;">
	<div class="col-lg-8">
		<?php include "inc/focusnoteCreator.php"; ?>
		<hr>
		
		<?php for ($i=25; $i > 0; $i--): ?>
		
			<?php $type = rand(0,1); ?>
			<div class="card mb-3 shadow mt-4 bc-callout <?php echo $type?'card-green':'card-blue'; ?>  ">
				<div class="card-body ">
				    <div class="card-text mb-2">
				    	<small class="text-muted">
				    		<b title="focusnote #<?php echo $i; ?>">#<?php echo $i; ?></b> Published on 6/26/2020 at 7:97 PM.

				    	</small>
						<div class="optionMenu float-right">
							<span class="button" value='<?php echo $i; ?>'></span>
							<ul style="display: none;">
								<li><a>Delete</a></li>
								<li><a>Edit</a></li>
							</ul>
						</div>
				    </div>
					<div class="card-title">
						<div class="row">
							<span class="h4 col-11">Title <?php echo $i; ?></span>
				    	</div>
					</div>
				    <div class="card-text">
				    	<p>
				    		Lorem ipsum dolor sit amet, consectetur adipisicing elit. At quia nesciunt autem dicta voluptate, id mollitia libero doloribus, possimus animi laudantium? Ducimus voluptatibus vero corporis voluptas ratione, assumenda odit libero
				    	</p>
				    	<p>
				    		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas excepturi vitae nam veritatis est! Quam voluptatem, at asperiores alias porro qui labore quod deleniti debitis aut minus id a, consequuntur?
				    	</p>
				    	<p>
				    		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat unde nisi dolorem temporibus ut, at eveniet deserunt, minima earum dolor saepe maxime magnam laboriosam, beatae eum! Velit quibusdam non libero.
				    	</p>
				    </div>

					<div class="card-text tags">
						<?php $max = rand(1,20); ?>
						<?php for ($j=1; $j <= $max; $j++): ?>
							<a href="#">#tag<?php echo $j; ?></a>
						<?php endfor ?>
					</div>
				</div>
			</div>
			<?php if (rand(0,1)==0): ?>
			<hr class="m-4">
			<?php endif ?>

		<?php endfor; ?>
	</div>
</div>


<?php include "footer.php"; ?>
