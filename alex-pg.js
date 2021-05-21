const express = require('express'), { Pool } = require('pg'), Chance = require('chance'), path = require('path'),
	app = express(), got = require('got'), port = 3700, pool = new Pool({ user: 'alex', password: 'pass'});

pool.on('error', (err, client) => { console.error('Postgres error', err); process.exit(-1) })

app.get('/info', async (req, res) => res.send({db: 'PostgreSQL'}));
app.get('/staff', async (req, res) => res.send((await pool.query('select _id, name, kind, custom, dob, avatar from staff left outer join aux on _id=id')).rows))
app.get('/staff/db', async (req, res) => 
	res.send({ ver: (await pool.query('select version()')).rows[0].version, 
	staff: `create table staff(${(await pool.query({text:"select column_name, udt_name from INFORMATION_SCHEMA.COLUMNS where table_name='staff'", rowMode: 'array'})).rows.map(col=>col.join(': ')).join(', ')})`})
);

app.put('/add/:n', async (req, res) => { let chance = new Chance(), n=req.params.n, IDs = [];
	for (let i=0; i<n; i++) { let pers, id, gender = chance.gender().toLowerCase(), name = chance.name({gender:gender}), state = chance.state();
		id = (await pool.query('insert into staff(name, kind, dob, custom) values($1, 1, $2, $3) returning _id', [name, chance.birthday(),
			{ adr: chance.address({short_suffix: true}), city: chance.city(), state: state, phone: chance.phone(),
			email: `${name.split(' ').join('.').toLocaleLowerCase()}@${state.toLowerCase()}.us.net` }])).rows[0]._id;
		IDs.push(id);
		(async (pers, gender, id) => pool.query('insert into aux(id, avatar) values($1,$2)', [id, (await got(`https://avatars.dicebear.com/api/${gender}/${id}.svg`)).body])
		)(pers, gender, id);
	}
	res.send(IDs)
})

app.delete('/clear', async (req, res) => { await pool.query('TRUNCATE staff, aux RESTART IDENTITY'); res.send([]); })

app.delete('/delete/:id', async (req, res) => { let id = req.params.id; await pool.query('delete from staff where _id=$1', [id]); res.send({ id }); })

app.get('/', (req,res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));
app.use(express.static('build'))

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})