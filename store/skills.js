module.exports.getSkills = db => {
  return db
    .get('skills')
    .value()
    .map(item => {
      const obj = { ...item };

      if (obj.hasOwnProperty('id')) {
        delete obj.id;
      }
      return obj;
    });
};

module.exports.getSkillValues = db => {
  return {
    age: db
      .get('skills')
      .find({ id: 'age' })
      .get('number')
      .value(),
    concerts: db
      .get('skills')
      .find({ id: 'concerts' })
      .get('number')
      .value(),
    cities: db
      .get('skills')
      .find({ id: 'cities' })
      .get('number')
      .value(),
    years: db
      .get('skills')
      .find({ id: 'years' })
      .get('number')
      .value()
  };
};

module.exports.setSkills = (db, arr) => {
  // arr = [{id, number}, ...]
  for (const item of arr) {
    db.get('skills')
      .find({ id: item.id })
      .assign({ number: parseInt(item.number) })
      .write();
  }
};
