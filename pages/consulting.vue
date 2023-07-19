<template>
  <main class="min-h-screen">
    <section class="mb-12 lg:pt-12 lg:mb-24">
      <div class="container mx-auto">
        <div class="flex flex-wrap">
          <div class="w-full text-center">
            <div class="py-8">
              <h1 class="text-4xl mb-0">
                Consulting Services
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container mx-auto">
        <div class="flex flex-wrap">
          <div class="w-full lg:w-2/3">
            <h2 class="text-2xl">
              Let's Work Together!
            </h2>
            <p class="mt-4">
              I'm a Software Engineer with a deep-rooted passion for crafting exceptional
              user experiences and
              web solutions. Over time, I've come to recognize that my expertise could truly make a difference
              for others in need of assistance with their online presence.
            </p>
            <p class="mt-4">
              With this in mind, I've recently decided to extend my services beyond my
              regular work hours to
              support friends, family, and small businesses within my community. My goal is to help them
              overcome common web development challenges and enhance their online footprint, using my skills
              in WordPress updates, plugin management, content updates, website backups, security monitoring,
              and minor customization projects.
            </p>
            <p class="mt-4">
              If you're in search of a helping hand for your web development needs, I'm here to assist you on
              this journey, providing personalized solutions tailored to your unique requirements.
            </p>
          </div>
          <div class="w-full lg:w-1/3">
            <img
              src="/images/Headshot.png"
              alt="Placeholder Headshot"
              class="w-full h-auto rounded-full mb-3 md:mb-0 px-4"
            >
          </div>
        </div>
        <div class="flex flex-wrap mt-24">
          <div class="w-full">
            <h2 class="text-2xl">
              Services
            </h2>
          </div>
          <div class="w-full grid gap-4 grid-cols-3 mt-4">
            <div
              v-for="(card, index) in cards"
              :key="index"
            >
              <CalloutCard>
                <template #content>
                  <div class="flex flex-col items-start">
                    <div class="text-3xl">
                      <font-awesome-icon :icon="card.icon" />
                    </div>
                    <h5 class="text-xl mt-2">
                      {{ card.heading }}
                    </h5>
                    <p class="mt-2 mb-0">
                      {{ card.text }}
                    </p>
                  </div>
                </template>
              </CalloutCard>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="my-24">
      <div class="container mx-auto">
        <div class="flex flex-wrap justify-center">
          <div class="w-full text-center">
            <div>
              <h2 class="text-2xl mb-4">
                Ready to enhance your online presence?
              </h2>
              <a
                href="mailto:hello@laneparton.com"
                class="bg-lightOrange text-white font-bold py-2 px-4 rounded"
              >Let's Chat</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
const cards = [
  {
    icon: "fa-solid fa-cloud-upload-alt",
    heading: "WordPress Updates",
    text: "Keep your WordPress site up-to-date with the latest versions for enhanced security and functionality."
  },
  {
    icon: "fa-solid fa-edit",
    heading: "Content Updates",
    text: "Add, update, or remove content on your website as needed to keep it fresh and engaging for your audience."
  },
  {
    icon: "fa-solid fa-hdd",
    heading: "Website Backups",
    text: "Regularly back up your website to protect your data and minimize the risk of loss due to technical issues or cyber threats."
  },
  {
    icon: "fa-solid fa-shield-alt",
    heading: "Security Monitoring",
    text: "Monitor your website for security threats and vulnerabilities, implementing measures to safeguard your online presence."
  },
  {
    icon: "fa-solid fa-cogs",
    heading: "Minor Customization Projects",
    text: "Make minor customizations and improvements to your website, tailored to your specific requirements and design preferences."
  },
  {
    icon: "fa-solid fa-chart-bar",
    heading: "Analytics Troubleshooting and Configuration",
    text: "Configure and troubleshoot web analytics tools, providing best practices to help you gain valuable insights into your website's performance and visitor behavior."
  }
]
</script>

<style lang="scss" scoped>
.icon {
    font-size: 1.75rem;
}
</style>
