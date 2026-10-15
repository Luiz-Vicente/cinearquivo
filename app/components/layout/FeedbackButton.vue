<script setup lang="ts">
type FeedbackType = 'suggestion' | 'bug' | 'content' | 'other'

interface FormSubmitResponse {
  success: string | boolean
  message?: string
}

const TYPES: FeedbackType[] = ['suggestion', 'bug', 'content', 'other']
const MIN_LENGTH = 10
const MAX_LENGTH = 2000

const { t, locale } = useI18n()
const route = useRoute()
const { feedback } = useAppConfig()

const open = ref(false)
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const form = reactive({ type: 'suggestion' as FeedbackType, message: '', name: '', email: '', honey: '' })
const typeOptions = computed(() => TYPES.map(value => ({ value, label: t(`feedback.types.${value}`) })))

// A fresh form after a successful send; drafts survive closing the dialog.
watch(open, (isOpen) => {
  if (isOpen && status.value === 'sent') status.value = 'idle'
})

function reset() {
  Object.assign(form, { type: 'suggestion', message: '', name: '', email: '', honey: '' })
}

async function submit() {
  // Bots fill the hidden field; pretend it worked.
  if (form.honey) {
    status.value = 'sent'
    return
  }
  status.value = 'sending'
  try {
    const response = await $fetch<FormSubmitResponse>(`https://formsubmit.co/ajax/${feedback.email}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: {
        _subject: `[${feedback.appName}] ${t(`feedback.types.${form.type}`)}`,
        _template: 'table',
        _captcha: 'false',
        Tipo: t(`feedback.types.${form.type}`),
        Mensagem: form.message.trim(),
        Nome: form.name.trim() || '—',
        // FormSubmit uses `email` as the reply-to address.
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
        Página: route.fullPath,
        Idioma: locale.value,
      },
    })
    if (String(response.success) !== 'true') throw new Error(response.message)
    status.value = 'sent'
    reset()
  }
  catch {
    status.value = 'error'
  }
}
</script>

<template>
  <div class="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 md:right-6 md:bottom-6">
    <BaseButton
      icon="message-square-heart"
      size="lg"
      :label="t('feedback.open')"
      class="shadow-card max-md:hidden"
      @click="open = true"
    />
    <BaseButton
      icon="message-square-heart"
      icon-only
      size="lg"
      :label="t('feedback.open')"
      class="shadow-card md:hidden"
      @click="open = true"
    />
  </div>

  <BaseModal
    v-model:open="open"
    :label="t('feedback.title')"
    size="sm"
  >
    <div class="p-6 md:p-8">
      <div
        v-if="status === 'sent'"
        class="flex flex-col items-center gap-4 py-6 text-center"
        role="status"
      >
        <div class="flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <BaseIcon
            name="heart-handshake"
            size="1.75em"
          />
        </div>
        <h2 class="font-display text-2xl text-text">
          {{ t('feedback.sentTitle') }}
        </h2>
        <p class="text-sm text-text-muted">
          {{ t('feedback.sentText') }}
        </p>
        <div class="flex flex-wrap justify-center gap-3 pt-2">
          <BaseButton
            variant="secondary"
            icon="pencil"
            :label="t('feedback.sendAnother')"
            @click="status = 'idle'"
          />
          <BaseButton
            :label="t('actions.close')"
            @click="open = false"
          />
        </div>
      </div>

      <form
        v-else
        class="space-y-4"
        @submit.prevent="submit"
      >
        <div class="space-y-1.5 pr-12">
          <h2 class="font-display text-2xl text-text">
            {{ t('feedback.title') }}
          </h2>
          <p class="text-sm text-text-muted">
            {{ t('feedback.description') }}
          </p>
        </div>

        <BaseSelect
          v-model="form.type"
          :options="typeOptions"
          :label="t('feedback.typeLabel')"
          icon="tag"
          block
        />
        <BaseTextarea
          v-model="form.message"
          :label="t('feedback.messageLabel')"
          :placeholder="t('feedback.messagePlaceholder')"
          :rows="5"
          :minlength="MIN_LENGTH"
          :maxlength="MAX_LENGTH"
          name="message"
          required
        />
        <div class="grid gap-3 sm:grid-cols-2">
          <BaseInput
            v-model="form.name"
            icon="user-round"
            :label="t('feedback.nameLabel')"
            :placeholder="t('feedback.nameLabel')"
            name="name"
            autocomplete="name"
            maxlength="80"
          />
          <BaseInput
            v-model="form.email"
            icon="mail"
            type="email"
            :label="t('feedback.emailLabel')"
            :placeholder="t('feedback.emailLabel')"
            name="email"
            autocomplete="email"
            maxlength="120"
          />
        </div>
        <!-- Honeypot: hidden from people, irresistible to spam bots. -->
        <input
          v-model="form.honey"
          type="text"
          name="_honey"
          tabindex="-1"
          autocomplete="off"
          aria-hidden="true"
          class="absolute -left-[9999px] size-px opacity-0"
        >

        <p
          v-if="status === 'error'"
          class="flex items-center gap-2 rounded-xl bg-accent/10 px-3 py-2 text-sm text-text"
          role="alert"
        >
          <BaseIcon
            name="circle-alert"
            class="shrink-0 text-accent"
          />
          {{ t('feedback.error') }}
        </p>

        <div class="flex justify-end pt-1">
          <BaseButton
            type="submit"
            icon="send"
            :loading="status === 'sending'"
            :label="status === 'sending' ? t('feedback.sending') : t('feedback.send')"
          />
        </div>
      </form>
    </div>
  </BaseModal>
</template>
