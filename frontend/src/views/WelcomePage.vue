<template>
  <div>
    <!-- Section 1 -->
    <section class="w-full px-6 pb-12 antialiased bg-white">
      <div class="mx-auto max-w-7xl">
        <nav
          class="relative z-50 h-24 select-none"
          x-data="{ showMenu: false }">
          <div
            class="
              container
              relative
              flex flex-wrap
              items-center
              justify-between
              h-24
              mx-auto
              overflow-hidden
              font-medium
              border-b border-gray-200
              md:overflow-visible
              lg:justify-center
              sm:px-4
              md:px-2
            ">
            <div class="flex items-center justify-start w-1/3 h-full pr-4">
              <a href="#" class="inline-block py-4 md:py-0">
                <span class="p-1 text-xl font-black leading-none text-gray-900"
                  ><span>Blockchain </span
                  ><span class="text-accent-600 whitespace-nowrap">Transfer Server</span></span
                >
              </a>
              <span class="p-1 text-lg font-bold text-gray-400 whitespace-nowrap"
                >@ {{ university }}</span
              >
            </div>
            <div
              class="
                top-0
                left-0
                items-start
                hidden
                w-full
                h-full
                p-4
                text-sm
                bg-gray-900 bg-opacity-50
                md:items-center md:w-2/3 md:absolute
                lg:text-base
                md:bg-transparent md:p-0 md:relative md:flex
              ">
              <div
                class="
                  flex-col
                  w-full
                  h-auto
                  overflow-hidden
                  bg-white
                  rounded-lg
                  md:bg-transparent
                  md:overflow-visible
                  md:rounded-none
                  md:relative
                  md:flex
                  md:flex-row
                ">
                <a
                  href="#"
                  class="
                    inline-flex
                    items-center
                    block
                    w-auto
                    h-16
                    px-6
                    text-xl
                    font-black
                    leading-none
                    text-gray-900
                    md:hidden
                  "
                  >tails<span class="text-accent-600">.</span></a
                >
                <div
                  class="
                    flex flex-col
                    items-start
                    justify-center
                    w-full
                    space-x-6
                    text-center
                    lg:space-x-8
                    md:w-1/2 md:mt-0 md:flex-row md:items-center
                  ">
                  <a
                    href="#"
                    class="
                      inline-block
                      w-full
                      py-2
                      mx-0
                      ml-6
                      font-medium
                      text-left text-accent-600
                      md:ml-0 md:w-auto md:px-0 md:mx-2
                      lg:mx-3
                      md:text-center
                    "
                    >Welcome</a
                  >
                  <a
                    href="#"
                    v-scroll-to="'#sectionFeatures'"
                    class="
                      inline-block
                      w-full
                      py-2
                      mx-0
                      font-medium
                      text-left text-gray-700
                      md:w-auto md:px-0 md:mx-2
                      hover:text-accent-600
                      lg:mx-3
                      md:text-center
                    "
                    >Features</a
                  >
                  <a
                    href="#"
                    v-scroll-to="'#sectionFAQ'"
                    class="
                      inline-block
                      w-full
                      py-2
                      mx-0
                      font-medium
                      text-left text-gray-700
                      md:w-auto md:px-0 md:mx-2
                      hover:text-accent-600
                      lg:mx-3
                      md:text-center
                    "
                    >FAQ</a
                  >
                  <a
                    href="#"
                    class="
                      absolute
                      top-0
                      left-0
                      hidden
                      py-2
                      mt-6
                      ml-10
                      mr-2
                      text-gray-600
                      lg:inline-block
                      md:mt-0 md:ml-2
                      lg:mx-3
                      md:relative
                    ">
                  </a>
                </div>
                <div
                  class="
                    flex flex-col
                    items-start
                    justify-end
                    w-full
                    pt-4
                    md:items-center md:w-1/3 md:flex-row md:py-0
                  ">
                  <router-link
                    to="/login"
                    class="
                      w-full
                      px-6
                      py-2
                      mr-0
                      text-gray-700
                      md:px-0
                      lg:pl-2
                      md:mr-4
                      lg:mr-5
                      md:w-auto
                    "
                    >Sign In</router-link
                  >
                  <router-link
                    to="/signup"
                    class="
                      inline-flex
                      items-center
                      w-full
                      px-6
                      py-3
                      text-sm
                      font-medium
                      leading-4
                      text-white
                      bg-accent-600
                      md:px-3 md:w-auto
                      lg:px-5
                      hover:bg-accent-500
                      focus:outline-none
                      md:focus:ring-2
                      focus:ring-0 focus:ring-offset-2 focus:ring-accent-600
                      rounded-2xl
                    "
                    >Sign Up</router-link
                  >
                </div>
              </div>
            </div>
          </div>
        </nav>

        <!-- Main Hero Content -->
        <div
          class="
            container
            max-w-lg
            px-4
            py-32
            mx-auto
            text-left
            md:max-w-none md:text-center
          ">
          <h1
            class="
              text-5xl
              font-extrabold
              leading-10
              tracking-tight
              text-left text-gray-900
              md:text-center
              sm:leading-none
              md:text-6xl
              lg:text-7xl
            ">
            <span class="inline md:block">Secure Transcript Transfer</span>
            <span
              class="
                relative
                mt-2
                text-transparent
                bg-clip-text bg-gradient-to-br
                from-accent-600
                to-accent-500
                md:inline-block
              "
              >Built on Blockchain</span
            >
          </h1>
          <div
            class="
              mx-auto
              mt-5
              text-gray-500
              md:mt-12 md:max-w-lg md:text-center
              lg:text-lg
            ">
            Sending, receiving, and verifying student transcripts is now easier
            and more secure than ever.
          </div>
          <div class="flex flex-col items-center mt-12 text-center">
            <CustomButton
              :on-click="() => this.$router.push('/signup')"
              text="Get Started Now"
              addition="Proof of Concept" />
            <a href="#" v-scroll-to="'#sectionFeatures'" class="mt-3 text-sm text-accent-600">Learn More</a>
          </div>
        </div>
        <!-- End Main Hero Content -->
      </div>
    </section>

    <!-- Section 2 -->
    <section id="sectionFeatures" class="py-20 bg-white">
      <div class="container max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold tracking-tight text-center">
          System Features
        </h2>
        <p class="mt-2 text-lg text-center text-gray-600">
          A digital, blockchain-supported transcript transfer system comes with several
          benefits:
        </p>
        <div
          class="
            grid grid-cols-4
            gap-8
            mt-10
            sm:grid-cols-8
            lg:grid-cols-12
            sm:px-8
            xl:px-0
          ">
          <div
            class="
              relative
              flex flex-col
              items-center
              justify-between
              col-span-4
              px-8
              py-12
              space-y-4
              overflow-hidden
              bg-gray-100
              rounded-2xl
            ">
            <div class="p-3 text-white bg-accent-600 rounded-2xl">
              <svg
                class="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512">
                <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path
                  d="M0 64C0 28.65 28.65 0 64 0H224V128C224 145.7 238.3 160 256 160H384V198.6C310.1 219.5 256 287.4 256 368C256 427.1 285.1 479.3 329.7 511.3C326.6 511.7 323.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM256 128V0L384 128H256zM576 368C576 447.5 511.5 512 432 512C352.5 512 288 447.5 288 368C288 288.5 352.5 224 432 224C511.5 224 576 288.5 576 368zM476.7 324.7L416 385.4L387.3 356.7C381.1 350.4 370.9 350.4 364.7 356.7C358.4 362.9 358.4 373.1 364.7 379.3L404.7 419.3C410.9 425.6 421.1 425.6 427.3 419.3L499.3 347.3C505.6 341.1 505.6 330.9 499.3 324.7C493.1 318.4 482.9 318.4 476.7 324.7H476.7z" />
              </svg>
            </div>
            <h4 class="text-xl font-medium text-gray-700">
              Secure Transcript Transfer
            </h4>
            <p class="text-base text-center text-gray-500">
              Each transcript is sent over an encrypted channel and its
              integrity is confirmed through a second channel.
            </p>
          </div>

          <div
            class="
              flex flex-col
              items-center
              justify-between
              col-span-4
              px-8
              py-12
              space-y-4
              bg-gray-100
              rounded-2xl
            ">
            <div class="p-3 text-white bg-accent-600 rounded-2xl">
              <svg
                class="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512">
                <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path
                  d="M336 64h-53.88C268.9 26.8 233.7 0 192 0S115.1 26.8 101.9 64H48C21.5 64 0 85.48 0 112v352C0 490.5 21.5 512 48 512h288c26.5 0 48-21.48 48-48v-352C384 85.48 362.5 64 336 64zM96 392c-13.25 0-24-10.75-24-24S82.75 344 96 344s24 10.75 24 24S109.3 392 96 392zM96 296c-13.25 0-24-10.75-24-24S82.75 248 96 248S120 258.8 120 272S109.3 296 96 296zM192 64c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S160 113.7 160 96C160 78.33 174.3 64 192 64zM304 384h-128C167.2 384 160 376.8 160 368C160 359.2 167.2 352 176 352h128c8.801 0 16 7.199 16 16C320 376.8 312.8 384 304 384zM304 288h-128C167.2 288 160 280.8 160 272C160 263.2 167.2 256 176 256h128C312.8 256 320 263.2 320 272C320 280.8 312.8 288 304 288z" />
              </svg>
            </div>
            <h4 class="text-xl font-medium text-gray-700">Logging</h4>
            <p class="text-base text-center text-gray-500">
              Every transfer is publicly logged on the blockchain, enabling a
              transparent, auditable process for everyone involved, while
              respecting everyone's privacy.
            </p>
          </div>

          <div
            class="
              flex flex-col
              items-center
              justify-between
              col-span-4
              px-8
              py-12
              space-y-4
              bg-gray-100
              rounded-2xl
            ">
            <div class="p-3 text-white bg-accent-600 rounded-2xl">
              <svg
                class="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512">
                <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path
                  d="M512 160c44.18 0 80-35.82 80-80S556.2 0 512 0c-44.18 0-80 35.82-80 80S467.8 160 512 160zM128 160c44.18 0 80-35.82 80-80S172.2 0 128 0C83.82 0 48 35.82 48 80S83.82 160 128 160zM319.9 320c57.41 0 103.1-46.56 103.1-104c0-57.44-46.54-104-103.1-104c-57.41 0-103.1 46.56-103.1 104C215.9 273.4 262.5 320 319.9 320zM368 400c0-16.69 3.398-32.46 8.619-47.36C374.3 352.5 372.2 352 369.9 352H270.1C191.6 352 128 411.7 128 485.3C128 500.1 140.7 512 156.4 512h266.1C389.5 485.6 368 445.5 368 400zM183.9 216c0-5.449 .9824-10.63 1.609-15.91C174.6 194.1 162.6 192 149.9 192H88.08C39.44 192 0 233.8 0 285.3C0 295.6 7.887 304 17.62 304h199.5C196.7 280.2 183.9 249.7 183.9 216zM551.9 192h-61.84c-12.8 0-24.88 3.037-35.86 8.24C454.8 205.5 455.8 210.6 455.8 216c0 21.47-5.625 41.38-14.65 59.34C462.2 263.4 486.1 256 512 256c42.48 0 80.27 18.74 106.6 48h3.756C632.1 304 640 295.6 640 285.3C640 233.8 600.6 192 551.9 192zM618.1 366.7c-5.025-16.01-13.59-30.62-24.75-42.71c-1.674-1.861-4.467-2.326-6.699-1.023l-19.17 11.07c-8.096-6.887-17.4-12.28-27.45-15.82V295.1c0-2.514-1.861-4.746-4.281-5.213c-16.56-3.723-33.5-3.629-49.32 0C484.9 291.2 483.1 293.5 483.1 295.1v22.24c-10.05 3.537-19.36 8.932-27.45 15.82l-19.26-11.07c-2.139-1.303-4.932-.8379-6.697 1.023c-11.17 12.1-19.73 26.71-24.66 42.71c-.7441 2.512 .2793 5.117 2.42 6.326l19.17 11.17c-1.859 10.42-1.859 21.21 0 31.64l-19.17 11.17c-2.234 1.209-3.164 3.816-2.42 6.328c4.932 16.01 13.49 30.52 24.66 42.71c1.766 1.863 4.467 2.328 6.697 1.025l19.26-11.07c8.094 6.887 17.4 12.28 27.45 15.82v22.24c0 2.514 1.77 4.746 4.188 5.211c16.66 3.723 33.5 3.629 49.32 0c2.42-.4648 4.281-2.697 4.281-5.211v-22.24c10.05-3.535 19.36-8.932 27.45-15.82l19.17 11.07c2.141 1.303 5.025 .8379 6.699-1.025c11.17-12.1 19.73-26.7 24.75-42.71c.7441-2.512-.2773-5.119-2.512-6.328l-19.17-11.17c1.953-10.42 1.953-21.22 0-31.64l19.17-11.17C618.7 371.8 619.7 369.2 618.1 366.7zM512 432c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32s32 14.33 32 32C544 417.7 529.7 432 512 432z" />
              </svg>
            </div>
            <h4 class="text-xl font-medium text-gray-700">
              Role Management
            </h4>
            <p class="text-base text-center text-gray-500">
              Apart from standard users processing student transcripts, every department has a department administrator.
              One university administrator ensures smooth operation over department borders.
            </p>
          </div>

          <div
            class="
              flex flex-col
              items-center
              justify-between
              col-span-4
              px-8
              py-12
              space-y-4
              bg-gray-100
              rounded-2xl
            ">
            <div class="p-3 text-white bg-accent-600 rounded-2xl">
              <svg
                class="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512">
                <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path
                  d="M50.73 58.53C58.86 42.27 75.48 32 93.67 32H208V160H0L50.73 58.53zM240 160V32H354.3C372.5 32 389.1 42.27 397.3 58.53L448 160H240zM448 416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V192H448V416z" />
              </svg>
            </div>
            <h4 class="text-xl font-medium text-gray-700">Containers</h4>
            <p class="text-base text-center text-gray-500">
              All services that a university must run come pre-built in easy to
              deploy containers with very low hardware and network requirements.
            </p>
          </div>

          <div
            class="
              flex flex-col
              items-center
              justify-between
              col-span-4
              px-8
              py-12
              space-y-4
              bg-gray-100
              rounded-2xl
            ">
            <div class="p-3 text-white bg-accent-600 rounded-2xl">
              <svg
                class="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512">
                <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path
                  d="M507.6 122.8c-2.904-12.09-18.25-16.13-27.04-7.338l-76.55 76.56l-83.1-.0002l0-83.1l76.55-76.56c8.791-8.789 4.75-24.14-7.336-27.04c-23.69-5.693-49.34-6.111-75.92 .2484c-61.45 14.7-109.4 66.9-119.2 129.3C189.8 160.8 192.3 186.7 200.1 210.1l-178.1 178.1c-28.12 28.12-28.12 73.69 0 101.8C35.16 504.1 53.56 512 71.1 512s36.84-7.031 50.91-21.09l178.1-178.1c23.46 7.736 49.31 10.24 76.17 6.004c62.41-9.84 114.6-57.8 129.3-119.2C513.7 172.1 513.3 146.5 507.6 122.8zM80 456c-13.25 0-24-10.75-24-24c0-13.26 10.75-24 24-24s24 10.74 24 24C104 445.3 93.25 456 80 456z" />
              </svg>
            </div>
            <h4 class="text-xl font-medium text-gray-700">
              Open for Customization
            </h4>
            <p class="text-base text-center text-gray-500">
              Everything is open-source and local services can be developed
              further to suit every university's unique needs.
            </p>
          </div>

          <div
            class="
              flex flex-col
              items-center
              justify-between
              col-span-4
              px-8
              py-12
              space-y-4
              bg-gray-100
              rounded-2xl
            ">
            <div class="p-3 text-white bg-accent-600 rounded-2xl">
              <svg
                class="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512">
                <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path
                  d="M32 176h370.8l-57.38 57.38c-12.5 12.5-12.5 32.75 0 45.25C351.6 284.9 359.8 288 368 288s16.38-3.125 22.62-9.375l112-112c12.5-12.5 12.5-32.75 0-45.25l-112-112c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25L402.8 112H32c-17.69 0-32 14.31-32 32S14.31 176 32 176zM480 336H109.3l57.38-57.38c12.5-12.5 12.5-32.75 0-45.25s-32.75-12.5-45.25 0l-112 112c-12.5 12.5-12.5 32.75 0 45.25l112 112C127.6 508.9 135.8 512 144 512s16.38-3.125 22.62-9.375c12.5-12.5 12.5-32.75 0-45.25L109.3 400H480c17.69 0 32-14.31 32-32S497.7 336 480 336z" />
              </svg>
            </div>
            <h4 class="text-xl font-medium text-gray-700">Flexible API</h4>
            <p class="text-base text-center text-gray-500">
              The system could be integrated into existing student information
              systems by using the transfer server API that every university
              hosts.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3 -->
    <section id="sectionFAQ" class="py-32 bg-white">
      <div class="px-8 mx-auto max-w-7xl lg:px-16">
        <h2 class="mb-4 text-xl font-bold md:text-3xl">
          Frequently Asked Questions
        </h2>
        <div
          class="grid grid-cols-1 gap-0 text-gray-600 md:grid-cols-2 md:gap-16">
          <div>
            <h5 class="mt-10 mb-3 font-semibold text-gray-900">
              Are transcripts saved on the blockchain?
            </h5>
            <p>No. The chain only holds the transcript hash, which cannot be used to gain any information on the
              transcript's content.</p>
            <h5 class="mt-10 mb-3 font-semibold text-gray-900">
              What is the role of the student in this system?
            </h5>
            <p>
              Students are no longer needlessly part of the transcript transfer
              process. Universities can directly exchange transcripts and
              students may be notified of that and be included in the following
              recognition process.
            </p>
            <h5 class="mt-10 mb-3 font-semibold text-gray-900">
              What does a digital transcript look like?
            </h5>
            <p>
              This is a question beyond the scope of this project. From a technical perspective it should be machine 
              readable, while still being understandable by a human if required. This favors text-based formates, such
              as XML and JSON. This prototype uses a custom XML format that wraps around the ELMO format for learner
              achievements.
            </p>
          </div>
          <div>
            <h5 class="mt-10 mb-3 font-semibold text-gray-900">
              What information is exposed on the blockchain?
            </h5>
            <p>
              For every transcript sent, the following information is logged on-chain:
              <ol class="ml-6 list-disc">
              <li>
                sending department and university
              </li>
              <li>
                receiving department and university
              </li>
              <li>
                transcript hash
              </li>
              </ol>
            </p>
            <h5 class="mt-10 mb-3 font-semibold text-gray-900">
              Do exchange coordinators need to store and use blockchain
              accounts/wallets?
            </h5>
            <p>
              No. The system is designed such that each university's transfer
              server is responsible for key management. Users will never need to
              directly interact with any key material. The transfer server can
              use a built-in login (username &amp; password) or can be
              integrated into a university-wide login system.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 5 -->
    <section class="text-gray-700 bg-white body-font">
      <div
        class="
          container
          flex flex-col
          items-center
          px-8
          py-8
          mx-auto
          max-w-7xl
          sm:flex-row
        ">
        <a
          href="#"
          class="text-xl font-black leading-none text-gray-900 select-none logo"
          >Blockchain <span class="text-accent-600">Transfer Server</span></a
        >
        <p
          class="
            mt-4
            text-sm text-gray-500
            sm:ml-4 sm:pl-4 sm:border-l sm:border-gray-200 sm:mt-0
          ">
          Proof of Concept created at 
          <a href="https://wwwmatthes.in.tum.de/pages/t5ma0jrv6q7k/sebis-Public-Website-Home" class="hover:underline text-accent-600">sebis</a> chair
          by Felix Hoops
        </p>
        <span
          class="
            inline-flex
            justify-center
            mt-4
            space-x-5
            sm:ml-auto sm:mt-0 sm:justify-start
            text-sm text-gray-500
          "
          >DO NOT use in production environment!</span
        >
      </div>
    </section>
  </div>
</template>

<script>
import CustomButton from "@/components/CustomButton";

export default {
  name: "WelcomePage",
  components: {
    CustomButton,
  },
  data() {
    return {
      showMenu: false,
      university: this.$config.university,
    };
  },
};
</script>

<style scoped></style>
