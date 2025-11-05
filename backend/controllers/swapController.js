const mongoose = require('mongoose');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');

exports.getSwappableSlots = async (req, res, next) => {
  try {
    const slots = await Event.find({ status: 'SWAPPABLE', owner: { $ne: req.user._id } }).populate('owner', 'name email');
    res.json(slots);
  } catch (err) { next(err); }
};

exports.createSwapRequest = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { mySlotId, theirSlotId } = req.body;
    if (!mySlotId || !theirSlotId) throw new Error('Missing slot IDs');

    const mySlot = await Event.findById(mySlotId).session(session);
    const theirSlot = await Event.findById(theirSlotId).session(session);

    if (!mySlot || !theirSlot) throw new Error('One or both slots not found');
    if (!mySlot.owner.equals(req.user._id)) throw new Error('You do not own mySlot');
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') throw new Error('One of slots not SWAPPABLE');
    if (theirSlot.owner.equals(req.user._id)) throw new Error('Cannot request your own slot');

    const swapReq = await SwapRequest.create([{
      requester: req.user._id,
      responder: theirSlot.owner,
      mySlot: mySlot._id,
      theirSlot: theirSlot._id,
      status: 'PENDING'
    }], { session });

    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save({ session });
    await theirSlot.save({ session });

    await session.commitTransaction();
    session.endSession();
    const result = await SwapRequest.findById(swapReq[0]._id).populate('mySlot theirSlot requester responder', 'title startTime endTime name email');
    res.status(201).json(result);
  } catch (err) {
    await session.abortTransaction().catch(()=>{});
    session.endSession();
    next(err);
  }
};

exports.getSwapRequests = async (req, res, next) => {
  try {
    const incoming = await SwapRequest.find({ responder: req.user._id }).populate('mySlot theirSlot requester responder');
    const outgoing = await SwapRequest.find({ requester: req.user._id }).populate('mySlot theirSlot requester responder');
    res.json({ incoming, outgoing });
  } catch (err) { next(err); }
};

exports.respondToSwap = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { accept } = req.body;
    const reqId = req.params.id;
    const swap = await SwapRequest.findById(reqId).session(session);
    if (!swap) throw new Error('Swap request not found');
    if (!swap.responder.equals(req.user._id)) throw new Error('Not authorized to respond');
    if (swap.status !== 'PENDING') throw new Error('Request already handled');

    const mySlot = await Event.findById(swap.mySlot).session(session);
    const theirSlot = await Event.findById(swap.theirSlot).session(session);

    if (!mySlot || !theirSlot) throw new Error('Slots no longer exist');

    if (!accept) {
      mySlot.status = 'SWAPPABLE';
      theirSlot.status = 'SWAPPABLE';
      swap.status = 'REJECTED';
      await mySlot.save({ session });
      await theirSlot.save({ session });
      await swap.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.json(swap);
    }

    const tmpOwner = mySlot.owner;
    mySlot.owner = theirSlot.owner;
    theirSlot.owner = tmpOwner;
    mySlot.status = 'BUSY';
    theirSlot.status = 'BUSY';
    swap.status = 'ACCEPTED';
    await mySlot.save({ session });
    await theirSlot.save({ session });
    await swap.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await SwapRequest.findById(swap._id).populate('mySlot theirSlot requester responder');
    return res.json(populated);
  } catch (err) {
    await session.abortTransaction().catch(()=>{});
    session.endSession();
    next(err);
  }
};
