import { fetchMe, getRoleLabel, updateMe } from './auth'
import { buildProfilePayload, mapProfileFormData, mapProfileUser } from '../utils/profile'

export async function loadProfile() {
  const rawUser = await fetchMe()
  const user = mapProfileUser(rawUser)

  return {
    user,
    roleLabel: getRoleLabel(user.role),
    profileData: mapProfileFormData(user, getRoleLabel(user.role)),
  }
}

export async function saveProfile(profileData, passwords, pinData) {
  const payload = buildProfilePayload(profileData, passwords, pinData)
  const rawUser = await updateMe(payload)
  const user = mapProfileUser(rawUser)

  return {
    user,
    roleLabel: getRoleLabel(user.role),
    profileData: mapProfileFormData(user, getRoleLabel(user.role)),
  }
}
