import { messenger } from "@/utils/messaging";
import * as common from "@istrust/common";
import i18n from "@istrust/i18n";
import {
  AlertBannerCertificate,
  AlertFirstVisit,
  AlertRegistration,
  AlertVisitFrequency,
} from "@istrust/ui/alert/index";
import { Country } from "@istrust/ui/country/index";
import { DateFrequency, DatePastPeriod } from "@istrust/ui/date/index";
import { FooterWebsiteAvailability } from "@istrust/ui/footer/index";
import { HeaderDomain, HeaderLogo } from "@istrust/ui/header/index";
import {
  IconBriefcase,
  IconCalendar1,
  IconCalendarCheck,
  IconMapPin,
  IconShield,
  IconShieldCheck,
  IconShieldX,
  IconUser,
} from "@istrust/ui/icon/index";
import { Issue, IssueButton, IssueLink } from "@istrust/ui/issue/index";
import { ListAdditionalItem } from "@istrust/ui/list/index";
import {
  Section,
  SectionItem,
  SectionItemNotAvailable,
} from "@istrust/ui/section/index";
import { SourceInfo, SourceVerification } from "@istrust/ui/source/index";
import { TermDNSSEC } from "@istrust/ui/term/index";
import { Browser, browser } from "#imports";
import {
  createResource,
  createSignal,
  ErrorBoundary,
  Match,
  onMount,
  Show,
  Suspense,
  Switch,
} from "solid-js";

async function get_tab() {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tabs.at(0);
}

export async function get_active_tab() {
  let tab = await get_tab();

  while (tab === undefined) {
    tab = await get_tab();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return tab;
}

export function App() {
  const [searchQuery, setSearchQuery] = createSignal<string>();

  const [mode, setMode] = createSignal<"attached" | "detached">();
  const [lang, setLang] = createSignal<string>("en");
  const [debug, setDebug] = createSignal<boolean>(false);

  const base = "https://istrust.org/";

  const [permissions, setPermissions] =
    createSignal<Browser.permissions.Permissions>();

  onMount(() => {
    setLang(navigator.language);

    const urlSearchParams = new URLSearchParams(window.location.search);

    const paramQuery = urlSearchParams.get("q");
    if (paramQuery !== null) {
      setMode("detached");
      setSearchQuery(paramQuery);

      if (urlSearchParams.get("debug") !== null) {
        setDebug(true);
      }
    } else {
      get_active_tab()
        .then((tab) => {
          if (tab.url !== undefined) {
            setMode("attached");
            try {
              setSearchQuery(new URL(tab.url).hostname);
            } catch {
              setSearchQuery(tab.url);
            }
          }
        })
        .catch(console.error);
    }

    browser.permissions
      .getAll()
      .then((allPermissions) => {
        setPermissions(allPermissions);
      })
      .catch(console.error);
  });

  const [domain] = createResource(searchQuery, async (query) => {
    return await messenger.sendMessage("get_effective_domain", {
      query,
    });
  });

  const [whoisData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await messenger.sendMessage("get_whois_data", {
        domain,
      });
    },
  );

  const [dnssecData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await messenger.sendMessage("get_dnssec_data", {
        domain,
      });
    },
  );

  const [certificateData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await messenger.sendMessage("get_certificate_data", {
        domain,
      });
    },
  );

  const [historyData] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await messenger.sendMessage("get_history_data", {
        domain,
      });
    },
  );

  return (
    <div
      class={
        mode() === "detached"
          ? "bg-background flex min-h-screen flex-col items-center justify-center gap-4"
          : undefined
      }
    >
      {mode() === "detached" && <HeaderLogo />}

      <div
        class={`${mode() === "detached" ? "ring-border rounded-lg ring-1" + " " : ""}bg-container flex w-sm flex-col p-4`}
      >
        <div class="relative flex flex-col">
          <ErrorBoundary
            fallback={(error: Error) => (
              <Issue base={base} lang={lang()} error={error} />
            )}
          >
            <HeaderDomain base={base} lang={lang()} value={domain()} />

            <AlertBannerCertificate
              lang={lang()}
              types={certificateData()?.types}
            />

            <div class="flex flex-col gap-1">
              <Section title={i18n("Owner", lang())}>
                <SectionItem
                  base={base}
                  lang={lang()}
                  title={i18n("Individual name", lang())}
                  description={<>{i18n("Individual name", lang())}</>}
                  prefix={<IconUser />}
                  informations={common.merge_informations(
                    certificateData()?.individuals,
                    whoisData()?.individuals,
                  )}
                  suffix={(individual) => (
                    <SourceVerification
                      lang={lang()}
                      information={individual}
                    />
                  )}
                >
                  {(individual, index) => (
                    <ListAdditionalItem index={index}>
                      {individual.value}
                    </ListAdditionalItem>
                  )}
                </SectionItem>

                <SectionItem
                  base={base}
                  lang={lang()}
                  title={i18n("Organization name", lang())}
                  description={<>{i18n("Organization name", lang())}</>}
                  prefix={<IconBriefcase />}
                  informations={common.merge_informations(
                    certificateData()?.organizations,
                    whoisData()?.organizations,
                  )}
                  suffix={(organization) => (
                    <SourceVerification
                      lang={lang()}
                      information={organization}
                    />
                  )}
                >
                  {(organization, index) => (
                    <ListAdditionalItem index={index}>
                      {organization.value}
                    </ListAdditionalItem>
                  )}
                </SectionItem>

                <SectionItem
                  base={base}
                  lang={lang()}
                  title={i18n("Country of residence", lang())}
                  description={<>{i18n("Country of residence", lang())}</>}
                  prefix={<IconMapPin />}
                  informations={common.merge_informations(
                    certificateData()?.countries,
                    whoisData()?.countries,
                  )}
                  suffix={(country) => (
                    <SourceVerification lang={lang()} information={country} />
                  )}
                >
                  {(country, index) => (
                    <ListAdditionalItem index={index}>
                      <Country
                        lang={lang()}
                        value={country.value}
                        type="text"
                      />
                    </ListAdditionalItem>
                  )}
                </SectionItem>
              </Section>

              <Section title={i18n("Domain", lang())}>
                <SectionItem
                  base={base}
                  lang={lang()}
                  title={i18n("Registration", lang())}
                  description={<>{i18n("Registration", lang())}</>}
                  prefix={<IconCalendar1 />}
                  informations={whoisData()?.registrations}
                  suffix={(registration) => (
                    <SourceInfo lang={lang()} information={registration} />
                  )}
                >
                  {(registration, index) => (
                    <AlertRegistration lang={lang()} date={registration.value}>
                      <Switch>
                        <Match when={index === 0}>
                          {i18n("Registered", lang())}{" "}
                          <DatePastPeriod
                            lang={lang()}
                            date={registration.value}
                          />
                        </Match>
                        <Match when={true}>
                          {i18n("and", lang())}{" "}
                          <DatePastPeriod
                            lang={lang()}
                            date={registration.value}
                          />
                        </Match>
                      </Switch>
                    </AlertRegistration>
                  )}
                </SectionItem>

                <SectionItem
                  base={base}
                  lang={lang()}
                  title={`${i18n("Protection with", lang())} DNSSEC`}
                  description={
                    <>
                      {i18n("Protection with", lang())}{" "}
                      <TermDNSSEC lang={lang()} />
                    </>
                  }
                  prefix={
                    <Suspense fallback={<IconShield />}>
                      <Show
                        when={dnssecData()?.valid}
                        fallback={<IconShield />}
                      >
                        {(valid) => (
                          <Switch>
                            <Match when={valid().value}>
                              <IconShieldCheck />
                            </Match>
                            <Match when={!valid().value}>
                              <IconShieldX />
                            </Match>
                          </Switch>
                        )}
                      </Show>
                    </Suspense>
                  }
                  informations={dnssecData()?.valid}
                  suffix={(valid) => (
                    <SourceInfo lang={lang()} information={valid} />
                  )}
                >
                  {(valid) => (
                    <Switch>
                      <Match when={valid.value}>
                        {i18n("Protected with", lang())}{" "}
                        <TermDNSSEC lang={lang()} />
                      </Match>
                      <Match when={!valid.value}>
                        {i18n("Not protected with", lang())}{" "}
                        <TermDNSSEC lang={lang()} />
                      </Match>
                    </Switch>
                  )}
                </SectionItem>
              </Section>

              <Switch>
                <Match when={import.meta.env.BROWSER === "safari"}>
                  <Section
                    title={i18n("Visit", lang())}
                    suffix={
                      <IssueLink href={`${base}#get`}>
                        {i18n("Not available in Safari", lang())}
                      </IssueLink>
                    }
                  >
                    <SectionItemNotAvailable
                      title={i18n("First visit", lang())}
                      prefix={<IconCalendar1 />}
                    />

                    <SectionItemNotAvailable
                      title={i18n("Frequency of visits", lang())}
                      prefix={<IconCalendarCheck />}
                    />
                  </Section>
                </Match>
                <Match
                  when={
                    permissions()?.permissions?.includes("history") !== true
                  }
                >
                  <Section
                    title={i18n("Visit", lang())}
                    suffix={
                      <IssueButton
                        onClick={() => {
                          const permision: Browser.permissions.Permissions = {
                            permissions: ["history"],
                          };
                          browser.permissions
                            .contains(permision)
                            .then((value) => {
                              if (!value) {
                                browser.permissions
                                  .request(permision)
                                  .then(() => {
                                    window.location.reload();
                                  })
                                  .catch(console.error);
                              }
                            })
                            .catch(console.error);
                        }}
                      >
                        {i18n("Require access to history", lang())}
                      </IssueButton>
                    }
                  >
                    <SectionItemNotAvailable
                      title={i18n("First visit", lang())}
                      prefix={<IconCalendar1 />}
                    />

                    <SectionItemNotAvailable
                      title={i18n("Frequency of visits", lang())}
                      prefix={<IconCalendarCheck />}
                    />
                  </Section>
                </Match>
                <Match when={true}>
                  <Section title={i18n("Visit", lang())}>
                    <SectionItem
                      base={base}
                      lang={lang()}
                      title={i18n("First visit", lang())}
                      description={<>{i18n("First visit", lang())}</>}
                      prefix={<IconCalendar1 />}
                      informations={historyData()?.visits}
                      suffix={(visits) => (
                        <SourceInfo lang={lang()} information={visits} />
                      )}
                    >
                      {(visits, index) => (
                        <AlertFirstVisit
                          lang={lang()}
                          firstVisit={visits.value.at(0)}
                        >
                          <Show when={visits.value.at(0)}>
                            {(firstVisit) => (
                              <Switch>
                                <Match when={index === 0}>
                                  {i18n("First visited", lang())}{" "}
                                  <DatePastPeriod
                                    lang={lang()}
                                    date={firstVisit()}
                                  />
                                </Match>
                                <Match when={true}>
                                  {i18n("and", lang())}{" "}
                                  <DatePastPeriod
                                    lang={lang()}
                                    date={firstVisit()}
                                  />
                                </Match>
                              </Switch>
                            )}
                          </Show>
                        </AlertFirstVisit>
                      )}
                    </SectionItem>

                    <SectionItem
                      base={base}
                      lang={lang()}
                      title={i18n("Frequency of visits", lang())}
                      description={<>{i18n("Frequency of visits", lang())}</>}
                      prefix={<IconCalendarCheck />}
                      informations={historyData()?.visits}
                      suffix={(visits) => (
                        <SourceInfo lang={lang()} information={visits} />
                      )}
                    >
                      {(visits, index) => (
                        <AlertVisitFrequency
                          lang={lang()}
                          firstVisit={visits.value.at(0)}
                        >
                          <Switch>
                            <Match when={index === 0}>
                              {i18n("Visited", lang())}{" "}
                              <DateFrequency
                                lang={lang()}
                                dates={visits.value}
                              />
                            </Match>
                            <Match when={true}>
                              {i18n("and", lang())}{" "}
                              <DateFrequency
                                lang={lang()}
                                dates={visits.value}
                              />
                            </Match>
                          </Switch>
                        </AlertVisitFrequency>
                      )}
                    </SectionItem>
                  </Section>
                </Match>
              </Switch>

              <FooterWebsiteAvailability
                base={base}
                lang={lang()}
                query={searchQuery()}
              />

              <Show when={debug()}>
                <Section title="Debug">
                  <details>
                    <summary>WHOIS raw data</summary>
                    <Show when={whoisData()}>
                      {(data) => (
                        <pre class="overflow-scroll">
                          {JSON.stringify(data(), undefined, 2)}
                        </pre>
                      )}
                    </Show>
                  </details>

                  <details>
                    <summary>certificate raw data</summary>
                    <Show when={certificateData()}>
                      {(data) => (
                        <pre class="overflow-scroll">
                          {JSON.stringify(data(), undefined, 2)}
                        </pre>
                      )}
                    </Show>
                  </details>

                  <details>
                    <summary>DNSSEC raw data</summary>
                    <Show when={dnssecData()}>
                      {(data) => (
                        <pre class="overflow-scroll">
                          {JSON.stringify(data(), undefined, 2)}
                        </pre>
                      )}
                    </Show>
                  </details>

                  <details>
                    <summary>history raw data</summary>
                    <Show when={historyData()}>
                      {(data) => (
                        <pre class="overflow-scroll">
                          {JSON.stringify(data(), undefined, 2)}
                        </pre>
                      )}
                    </Show>
                  </details>
                </Section>
              </Show>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
