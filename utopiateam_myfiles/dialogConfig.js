/**
 * ダイアログの初期設定オブジェクトを持つネームスペース
 */
const dialogConfig = {
	loginError: {
		autoOpen: false,
		width: 550,
		modal: true,
		buttons: [
			{
				text: 'OK',
				click: function() {
					$(this).dialog('close');
				}
			},
		]
	},
	duplicatedUserName: {
		autoOpen: false,
		width: 650,
		modal: true,
		buttons: [
			{
				text: 'OK',
				click: function() {
					$(this).dialog('close');
				}
			},
		]
	},
	inputUserError: {
		autoOpen: false,
		width: 650,
		modal: true,
		buttons: [
			{
				text: 'OK',
				click: function() {
					$(this).dialog('close');
				}
			},
		]
	},
	inputUserConfirm: {
		autoOpen: false,
		width: 850,
		modal: true,
		buttons: [
			{
				text: '登録',
				click: function() {
					let jsonString = {
						'familyName': $('table#register input[name=familyName]').val(),
						'firstName': $('table#register input[name=firstName]').val(),
						'familyNameKana': $('table#register input[name=familyNameKana]').val(),
						'firstNameKana': $('table#register input[name=firstNameKana]').val(),
						'gender': $('table#register input[name=gender]:checked').val() == '男性' ? '0' : '1',
						'userName': $('table#register input[name=userName]').val(),
						'password': $('table#register input[name=password]').val()
					};
					$.ajax({
						type: 'POST',
						url: '/utopia/user/register',
						data: JSON.stringify(jsonString),
						contentType: 'application/json',
						scriptCharset: 'utf-8'
					})
					.then((result) => {
						$('.info').removeClass('hidden');
						$('#checkOK').addClass('hidden');
						$('table#register input[name=familyName]').val('');
						$('table#register input[name=firstName]').val('');
						$('table#register input[name=familyNameKana]').val('');
						$('table#register input[name=firstNameKana]').val('');
						($('table#register input[name=gender]')[0]).checked = true;
						$('table#register input[name=userName]').val('');
						$('table#register input[name=password]').val('');
					}, () => {
						alert('Error: ajax connection failed.');
					});
					$(this).dialog('close');
				}
			},
			{
				text: '戻って修正',
				click: function() {
					$(this).dialog("close");
				}
			},
		]
	},
	resetPassword: {
		autoOpen: false,
		width: 750,
		modal: true,
		buttons: [
			{
				text: 'OK',
				click: function() {
					/* フロントのみで完結できるエラーチェック */
					let newPassword = $('table.resetPassword input[name=newPassword]').val();
					let newPasswordConfirm = $('table.resetPassword input[name=newPasswordConfirm]').val();
					let isError = false;
					if (validator.isEmpty(newPassword) || validator.isEmpty(newPasswordConfirm) ||
							!validator.isHalfAlphanumeric(newPassword) || !validator.isHalfAlphanumeric(newPasswordConfirm) ||
							validator.overMax(newPassword, 16) || validator.overMax(newPasswordConfirm, 16) ||
							validator.underMin(newPassword, 6) || validator.underMin(newPasswordConfirm, 6)) {
						alert('新パスワード、または新パスワード確認の入力が不正です。');
						$('table.resetPassword input[name=password]').val('');
						$('table.resetPassword input[name=newPassword]').val('');
						$('table.resetPassword input[name=newPasswordConfirm]').val('');
						return;
					}
					
					/* ajaxでのエラーチェック */
					let jsonString = {
								'userName': $('table.resetPassword span').text(),
								'password': $('table.resetPassword input[name=password]').val(),
								'newPassword': newPassword,
								'newPasswordConfirm': newPasswordConfirm
					};
					$.ajax({
						type: 'POST',
						url: '/utopia/auth/resetPassword',
						data: JSON.stringify(jsonString),
						contentType: 'application/json',
						scriptCharset: 'utf-8'
					})
					.then((result) => {
						alert(result);
						$('table.resetPassword input[name=password]').val('');
						$('table.resetPassword input[name=newPassword]').val('');
						$('table.resetPassword input[name=newPasswordConfirm]').val('');
						if (result === 'パスワードが再設定されました。') {
							let asters = '';
							for (let i = 0; i < newPassword.length; i ++) {
								asters += '*';
							}
							$('span.password').text(asters);
							$(this).dialog('close');
						}
					}, () => {
						alert('Error: ajax connection failed.');
						$(this).dialog('close');
					});
				}
			},
		]
	},
	inputDestinationError: {
		autoOpen: false,
		width: 650,
		modal: true,
		buttons: [
			{
				text: 'OK',
				click: function() {
					$(this).dialog('close');
				}
			},
		]
	},
	inputDestinationConfirm: {
		autoOpen: false,
		width: 850,
		modal: true,
		buttons: [
			{
				text: '登録',
				click: function() {
					let jsonString = {
						'familyName': $('table#register input[name=familyName]').val(),
						'firstName': $('table#register input[name=firstName]').val(),
						'address': $('table#register input[name=address]').val(),
						'telNumber': $('table#register input[name=telNumber]').val()
					};
					$.ajax({
						type: 'POST',
						url: '/utopia/destination/register',
						data: JSON.stringify(jsonString),
						contentType: 'application/json',
						scriptCharset: 'utf-8'
					})
					.then((result) => {
						alert('登録が完了しました。');
						// 登録が完了したら決済処理をおこなう
						settlement(result);
						
					}, () => {
						alert('Error: ajax connection failed.');
					});
					$(this).dialog('close');
				},
			},
			{
				text: '戻って修正',
				click: function() {
					$(this).dialog("close");
				}
			},
		]
	},
};

/**
 * 決済処理をおこなう
 * @param destinationId 宛先情報ID
 */
function settlement(destinationId) {
	$.ajax({
		type: 'POST',
		url: '/utopia/settlement/complete',
		data: JSON.stringify({'destinationId': destinationId}),
		contentType: 'application/json',
	})
	.then((result) => {
		location.replace('/utopia/history/');
	}, () => {
		alert('Error: ajax connection failed.');
	});
}

/**
 * 確認ダイアログを作成する
 * @param checkerConfig エラーチェック用の設定オブジェクト
 */
function createConfirmDialog(checkerConfig) {
	for ([key, value] of Object.entries(checkerConfig)) {
		let obj = $('table#register input[name=' + key + ']');
		let objConfirm = $('table.confirm span.' + key);
		
		let value = $(obj).val();
		
		if (key === 'gender') {
			value = $('table#register input[name=gender]:checked').val();
		}
		if (key === 'password') {
			let tmpValue = '';
			for (let i = 0; i < value.length; i ++) {
				tmpValue += '*';
			}
			value = tmpValue;
		}
		
		$(objConfirm).html(value);
	}
}
