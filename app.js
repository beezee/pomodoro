(function($, exports, undefined){

	var Clock = function(){
		var self = this;

		self.ticked = function(){};
		self.stateChanged = function(){};

		var currentState = 'Pomodoro';
		var currentPomodoroCount = 1;
		var timeRemaining = 60*25;
		var interval = false;

		var stateTransitions = {
			'Pomodoro': function() {
				return (((currentPomodoroCount) % 4 == 0))
					? 'Long Break'
					: 'Short Break';
			},
			'Short Break': function() {
				return 'Pomodoro';
			},
			'Long Break': function() {
				return 'Pomodoro';
			}
		};

		var enterState = {
			'Pomodoro': function() {
				currentState = 'Pomodoro';
				timeRemaining = 60*25;
			},
			'Short Break': function() {
				currentPomodoroCount++;
				currentState = 'Short Break';
				timeRemaining = 60*5;
			},
			'Long Break': function() {
				currentPomodoroCount++;
				currentState = 'Long Break';
				timeRemaining = 60*15;
			}
		};

		self.tick = function(){
			timeRemaining--;
			self.ticked();
			if (timeRemaining === 0)
				self.changeState();
		};

		self.changeState = function(){
			var nextState = stateTransitions[currentState]();
			enterState[nextState]();
			self.stateChanged();
		};

		self.timeRemaining = function(){
			return timeRemaining;
		};

		self.currentPomodoro = function(){
			return currentPomodoroCount;
		};

		self.currentState = function(){
			return currentState;
		};

		self.start = function(){
			if (interval)
				clearInterval(interval);
			interval = setInterval(self.tick, 1000);
		};

		self.stop = function(){
			if (interval)
				clearInterval(interval);
			interval = false;
		};

		self.running = function(){
			return interval;
		};
	};

	$('document').ready(function(){

		var clock = new Clock();
		
		var formatSeconds = function(seconds){
			return (new Date).clearTime()
				.addSeconds(seconds)
					.toString('mm:ss');
		};

		var toggle = function() {
			if (clock.running()){
				clock.stop();
				$('.clock-toggle').text('Start');
				return;
			}
			clock.start();
			$('.clock-toggle').text('Stop');
		};

		var playAudio = function(id) {
			var audioTag = document.getElementById(id);
			if (typeof audioTag.play === 'function')
				audioTag.play();
		};

		clock.stateChanged = function(){
			var currentState = clock.currentState();
			if (currentState == 'Pomodoro')
				currentState += ' #'+clock.currentPomodoro();
			var audioId = (clock.currentState() == 'Pomodoro')
				? 'start-sound' : 'break-sound';
			playAudio(audioId);
			$('#current-state .inn').text(currentState);
			$('.timer').text(formatSeconds(clock.timeRemaining()));
		};

		clock.ticked = function(){
			$('.timer').text(formatSeconds(clock.timeRemaining()));
		};

		$('.clock-toggle').click(toggle);

		
	});

})(jQuery, window);
