const Event = require('../models/Event');

exports.listUserEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ owner: req.user._id }).sort({ startTime: 1 });
    res.json(events);
  } catch (err) { next(err); }
};

exports.createEvent = async (req, res, next) => {
  try {
    const { title, startTime, endTime, status } = req.body;
    if (!title || !startTime || !endTime) return res.status(400).json({ error: 'Missing fields' });

    const e = await Event.create({
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: status || 'BUSY',
      owner: req.user._id
    });
    res.status(201).json(e);
  } catch (err) { next(err); }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    if (!ev.owner.equals(req.user._id)) return res.status(403).json({ error: 'Not authorized' });

    const { title, startTime, endTime, status } = req.body;
    if (title) ev.title = title;
    if (startTime) ev.startTime = new Date(startTime);
    if (endTime) ev.endTime = new Date(endTime);
    if (status) ev.status = status;
    await ev.save();
    res.json(ev);
  } catch (err) { next(err); }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    if (!ev.owner.equals(req.user._id)) return res.status(403).json({ error: 'Not authorized' });
    await ev.deleteOne();
    res.json({ ok: true });
  } catch (err) { next(err); }
};

exports.makeSwappable = async (req, res, next) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    if (!ev.owner.equals(req.user._id)) return res.status(403).json({ error: 'Not authorized' });
    ev.status = 'SWAPPABLE';
    await ev.save();
    res.json(ev);
  } catch (err) { next(err); }
};

exports.makeBusy = async (req, res, next) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    if (!ev.owner.equals(req.user._id)) return res.status(403).json({ error: 'Not authorized' });
    ev.status = 'BUSY';
    await ev.save();
    res.json(ev);
  } catch (err) { next(err); }
};
