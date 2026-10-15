<script setup lang="ts">
const { t } = useI18n()
const { support } = useAppConfig()
const { copy, copied, isSupported } = useClipboard({ source: support.pixCode, copiedDuring: 2500 })
</script>

<template>
  <div class="flex flex-col items-center gap-4 text-center">
    <div class="rounded-2xl bg-white p-2.5 shadow-card ring-1 ring-border">
      <img
        src="/pix-qr.svg"
        :alt="t('support.qrAlt')"
        width="176"
        height="176"
        class="size-40 md:size-44"
      >
    </div>
    <p class="text-xs font-semibold text-text-muted">
      {{ t('support.scan') }}
    </p>
    <div class="w-full max-w-xs space-y-2">
      <p class="text-xs text-text-subtle">
        {{ t('support.or') }}
      </p>
      <code class="block truncate rounded-xl bg-surface-sunken px-3 py-2 font-mono text-xs text-text-muted select-all">{{ support.pixCode }}</code>
      <BaseButton
        v-if="isSupported"
        block
        :icon="copied ? 'check' : 'copy'"
        :label="copied ? t('support.copied') : t('support.copy')"
        @click="copy()"
      />
      <p class="text-xs text-text-subtle">
        {{ t('support.recipient', { name: support.recipient }) }}
      </p>
    </div>
  </div>
</template>
