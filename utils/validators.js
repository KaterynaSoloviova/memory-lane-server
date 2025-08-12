export function isLocked(capsule) {
  return capsule.isLocked && capsule.unlockedDate > new Date();
}

export function isUnlocked(capsule) {
  return capsule.isLocked && capsule.unlockedDate <= new Date();
}

export function isDraft(capsule) {
  return !capsule.isLocked;
}

export function isOwner(capsule, userId) {
  return capsule.createdBy._id.toString() === userId;
}

export function canSeeCapsule(capsule, userId) {
  return (
    (isUnlocked(capsule) && isOwner(capsule, userId)) ||
    (isUnlocked(capsule) && capsule.participants.includes(userId)) ||
    (isUnlocked(capsule) && capsule.isPublic) ||
    (isDraft(capsule) && isOwner(capsule, userId))
  );
}