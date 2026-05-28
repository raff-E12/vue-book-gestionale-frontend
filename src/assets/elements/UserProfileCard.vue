<template>
  <div class="profile-card">
    <!-- Background decoration -->
    <div class="card-bg-blob blob-1" />
    <div class="card-bg-blob blob-2" />

    <div class="profile-card-inner">
      <!-- Avatar + identity -->
      <div class="identity">
        <div class="avatar-ring">
          <div class="avatar" :style="{ background: avatarGradient }">
            {{ initials }}
          </div>
          <span v-if="user.verified" class="verified-badge" title="Account verificato">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </span>
        </div>

        <div class="identity-text">
          <h2 class="profile-name">{{ user.fullname || 'Utente' }}</h2>
          <p class="profile-email">{{ user.email }}</p>
          <span class="role-chip" :class="user.role.toLowerCase()">
            {{ user.role || 'User' }}
          </span>
        </div>
      </div>

      <!-- Stats row -->
      <div class="profile-stats">
        <div class="stat-block">
          <span class="stat-num">{{ totalOrders }}</span>
          <span class="stat-desc">Ordini totali</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-block">
          <span class="stat-num">{{ completedOrders }}</span>
          <span class="stat-desc">Completati</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-block">
          <span class="stat-num">€{{ totalSpent.toFixed(0) }}</span>
          <span class="stat-desc">Spesa totale</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-block">
          <span class="stat-num">{{ totalBooks }}</span>
          <span class="stat-desc">Libri acquistati</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserState, OrdersList } from '../../stores/OrdersStore'

const props = defineProps<{
  user: UserState
  orders: OrdersList[]
}>()

const initials = computed(() =>
  props.user.fullname
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'
)

// Deterministic gradient from name
const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
]

const avatarGradient = computed(() => {
  let h = 0
  for (const c of props.user.fullname) h = (h * 31 + c.charCodeAt(0)) | 0
  return GRADIENTS[Math.abs(h) % GRADIENTS.length]
})

const totalOrders    = computed(() => props.orders.length)
const completedOrders = computed(() => props.orders.filter(o => o.Order).length)
const totalSpent     = computed(() => props.orders.reduce((s, o) => s + o.TotalPrice, 0))
const totalBooks     = computed(() => props.orders.reduce((s, o) => s + o.BookList.reduce((b, bk) => b + bk.Quanity, 0), 0))
</script>

<style scoped>
.profile-card {
  position: relative;
  background: linear-gradient(145deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%);
  border-radius: 28px;
  overflow: hidden;
  margin-bottom: 32px;
  box-shadow: 0 20px 60px rgba(67, 56, 202, 0.35);
}

.card-bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.25;
  pointer-events: none;
}

.blob-1 {
  width: 300px; height: 300px;
  background: #818cf8;
  top: -80px; right: -60px;
}

.blob-2 {
  width: 200px; height: 200px;
  background: #c084fc;
  bottom: -60px; left: 40px;
}

.profile-card-inner {
  position: relative;
  z-index: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Identity */
.identity {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-ring {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 72px; height: 72px;
  border-radius: 22px;
  display: grid; place-items: center;
  color: white;
  font-weight: 800; font-size: 22px;
  letter-spacing: -0.5px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}

.verified-badge {
  position: absolute;
  bottom: -4px; right: -4px;
  width: 22px; height: 22px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid #312e81;
  display: grid; place-items: center;
}

.identity-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  margin: 0;
  font-size: 22px; font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.3px;
}

.profile-email {
  margin: 0;
  font-size: 14px;
  color: rgba(255,255,255,0.6);
}

.role-chip {
  display: inline-block;
  margin-top: 4px;
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  padding: 3px 10px; border-radius: 999px;
  background: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.9);
  backdrop-filter: blur(4px);
  width: fit-content;
}

.role-chip.admin { background: rgba(251,191,36,0.25); color: #fde68a; }
.role-chip.user  { background: rgba(167,139,250,0.25); color: #ddd6fe; }

/* Stats */
.profile-stats {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 18px;
  padding: 18px 24px;
  backdrop-filter: blur(8px);
  gap: 0;
}

.stat-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-num {
  font-size: 22px; font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.stat-desc {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  font-weight: 500;
}

.stat-divider {
  width: 1px; height: 36px;
  background: rgba(255,255,255,0.15);
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 600px) {
  .profile-card-inner { padding: 24px 20px; }

  .profile-name { font-size: 18px; }

  .stat-num { font-size: 18px; }

  .stat-desc { font-size: 11px; }

  .profile-stats { padding: 14px 12px; gap: 0; }
}
</style>
