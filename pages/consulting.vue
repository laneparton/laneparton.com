<template>
  <main class="page">
    <section class="hero">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 text-center">
            <div class="pages-heading">
              <h1 class="title mb-0">
                Consulting Services
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-12">
            <h2>Let's Work Together!</h2>
            <p>
              I'm a Software Engineer with a deep-rooted passion for crafting exceptional
              user experiences and
              web solutions. Over time, I've come to recognize that my expertise could truly make a difference
              for others in need of assistance with their online presence.
            </p>
            <p>
              With this in mind, I've recently decided to extend my services beyond my
              regular work hours to
              support friends, family, and small businesses within my community. My goal is to help them
              overcome common web development challenges and enhance their online footprint, using my skills
              in WordPress updates, plugin management, content updates, website backups, security monitoring,
              and minor customization projects.
            </p>
            <p>
              If you're in search of a helping hand for your web development needs, I'm here to assist you on
              this journey, providing personalized solutions tailored to your unique requirements.
            </p>
          </div>
          <div class="col-lg-4 col-12">
            <img
              src="/images/Headshot.png"
              alt="Placeholder Headshot"
              class="img-fluid rounded-circle mb-3 mb-md-0 px-4"
            >
          </div>
        </div>
        <div class="row mt-100">
          <div class="col-12">
            <h2>Services</h2>
          </div>
          <div class="col-md-4 col-12 mt-4">
            <div class="card custom-card shadow-sm">
              <div class="card-body">
                <div class="icon">
                  <font-awesome-icon icon="fa-solid fa-cloud-upload-alt" />
                </div>
                <h5 class="custom-card-title">
                  WordPress Updates
                </h5>
                <p class="mb-0">
                  Keep your WordPress site up-to-date with the latest versions for
                  enhanced security and functionality.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-12 mt-4">
            <div class="card custom-card shadow-sm">
              <div class="card-body">
                <div class="icon">
                  <font-awesome-icon icon="fa-solid fa-edit" />
                </div>
                <h5 class="custom-card-title">
                  Content Updates
                </h5>
                <p class="mb-0">
                  Add, update, or remove content on your website as needed to keep
                  it fresh and engaging for your audience.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-12 mt-4">
            <div class="card custom-card shadow-sm">
              <div class="card-body">
                <div class="icon">
                  <font-awesome-icon icon="fa-solid fa-hdd" />
                </div>
                <h5 class="custom-card-title">
                  Website Backups
                </h5>
                <p class="mb-0">
                  Regularly back up your website to protect your data and minimize
                  the risk of loss due to technical issues or cyber threats.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-12 mt-4">
            <div class="card custom-card shadow-sm">
              <div class="card-body">
                <div class="icon">
                  <font-awesome-icon icon="fa-solid fa-shield-alt" />
                </div>
                <h5 class="custom-card-title">
                  Security Monitoring
                </h5>
                <p class="mb-0">
                  Monitor your website for security threats and vulnerabilities,
                  implementing measures to safeguard your online presence.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-12 mt-4">
            <div class="card custom-card shadow-sm">
              <div class="card-body">
                <div class="icon">
                  <font-awesome-icon icon="fa-solid fa-cogs" />
                </div>
                <h5 class="custom-card-title">
                  Minor Customization Projects
                </h5>
                <p class="mb-0">
                  Make minor customizations and improvements to your website,
                  tailored to your specific requirements and design preferences.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-12 mt-4">
            <div class="card custom-card shadow-sm">
              <div class="card-body">
                <div class="icon">
                  <font-awesome-icon icon="fa-solid fa-chart-bar" />
                </div>

                <h5 class="custom-card-title">
                  Web Analytics Troubleshooting
                  and Configuration
                </h5>
                <p class="mb-0">
                  Configure and troubleshoot web analytics tools, providing best
                  practices to help you gain valuable insights into your website's performance and visitor
                  behavior.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container my-100">
        <div class="row justify-content-center">
          <div class="col-12 text-center">
            <div class="section-title">
              <h2 class="title mb-4">
                Ready to enhance your online presence?
              </h2>
              <a
                href="mailto:hello@laneparton.com"
                class="btn btn-primary"
              >Let's Chat</a>
            </div>
          </div>
        </div><!--end row-->
      </div><!--end container-->
    </section>
  </main>
</template>

<style lang="scss" scoped>
.hero {
    margin-bottom: 50px;

    @media (min-width: 992px) {
      padding-top: 50px;
      margin-bottom: 100px;
    }
}

.custom-card {
    background-color: #212f40;
    border: 1px solid #2f435b;
    border-radius: 5px;
    height: 100%;
    padding: 1rem;

    .card-body {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .custom-btn {
            margin-top: auto;
        }
    }
}

.icon {
    font-size: 1.75rem;
}</style>