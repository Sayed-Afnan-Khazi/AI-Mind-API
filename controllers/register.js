const handleRegister = (req,res,db,bcrypt) => {
	if (!req.body.email || !req.body.name || !req.body.password) {
		res.status(400).json('Invalid data');
		return;
	}
	const hash = bcrypt.hashSync(req.body.password,8); // 8 salt rounds
	db.transaction(trx=>{
		trx.insert({
			hash: hash,
			email: req.body.email
		})
		.into('login')
		.returning('email')
		.then(loginEmail=>{
			trx.insert({
				email:loginEmail[0].email,
				name:req.body.name,
				joined: new Date()
			})
			.into('users')
			.returning('*')
			.then(user=>res.status(200).json(user[0]))
			.catch(err=>res.status(400).json('Unable to register.'))
		})
		.then(trx.commit)
		.catch(trx.rollback)
	}).catch(err=>res.status(400).json('Unable to register.'))
}

module.exports = {
	handleRegister: handleRegister
}