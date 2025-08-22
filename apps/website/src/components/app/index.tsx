import * as common from "@istrust/common";
import i18n from "@istrust/i18n";
import {
  AlertBannerCertificate,
  AlertRegistration,
} from "@istrust/ui/alert/index";
import { Country } from "@istrust/ui/country/index";
import { DatePastPeriod } from "@istrust/ui/date/index";
import { HeaderDomain } from "@istrust/ui/header/index";
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
import { Issue, IssueLink } from "@istrust/ui/issue/index";
import { ListAdditionalItem } from "@istrust/ui/list/index";
import { SearchBar } from "@istrust/ui/search/index";
import {
  Section,
  SectionItem,
  SectionItemNotAvailable,
} from "@istrust/ui/section/index";
import { SourceInfo, SourceVerification } from "@istrust/ui/source/index";
import { TermDNSSEC } from "@istrust/ui/term/index";
import {
  createResource,
  createSignal,
  ErrorBoundary,
  Match,
  onMount,
  resetErrorBoundaries,
  Show,
  Suspense,
  Switch,
} from "solid-js";

const cache: common.InformationCache = {
  psl: {
    set: async (key: string, value: string) => {
      return new Promise<void>((resolve) => {
        localStorage.setItem(`psl:${key}`, value);
        resolve();
      });
    },
    get: async (key: string) => {
      return new Promise<string | undefined>((resolve) => {
        const item = localStorage.getItem(`psl:${key}`);
        if (item === null) {
          resolve(undefined);
        } else {
          resolve(item);
        }
      });
    },
    clear: async () => {
      return new Promise<void>((resolve) => {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key === null) continue;

          if (key.startsWith("psl:")) {
            localStorage.removeItem(key);
          }
        }

        resolve();
      });
    },
  },
  rdap: {
    set: async (key: string, value: string) => {
      return new Promise<void>((resolve) => {
        localStorage.setItem(`rdap:${key}`, value);
        resolve();
      });
    },
    get: async (key: string) => {
      return new Promise<string | undefined>((resolve) => {
        const item = localStorage.getItem(`rdap:${key}`);
        if (item === null) {
          resolve(undefined);
        } else {
          resolve(item);
        }
      });
    },
    clear: async () => {
      return new Promise<void>((resolve) => {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key === null) continue;

          if (key.startsWith("rdap:")) {
            localStorage.removeItem(key);
          }
        }
        resolve();
      });
    },
  },
};

export function App(props: { lang: string }) {
  const [searchQuery, setSearchQuery] = createSignal<{
    text: string;
    forceUpdateCache: boolean;
  }>();

  const [initValue, setInitValue] = createSignal<string>();
  const [debug, setDebug] = createSignal<boolean>(false);

  onMount(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);

    const paramQuery = urlSearchParams.get("q");
    if (paramQuery !== null) {
      setInitValue(paramQuery);
    }

    if (urlSearchParams.get("debug") !== null) {
      setDebug(true);
    }
  });

  const [domain, { mutate: mutateDomain }] = createResource(
    searchQuery,
    async (query) => {
      if (query.forceUpdateCache) {
        await common.force_update_cache(cache);
      }

      try {
        return await common.get_effective_domain(query.text, cache);
      } catch (error) {
        reset();
        throw error;
      }
    },
  );

  const [whoisData, { mutate: mutateWhoisData }] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_whois_data(domain, cache);
    },
  );

  const [dnssecData, { mutate: mutateDnssecData }] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_dnssec_data(domain);
    },
  );

  const [certificateData, { mutate: mutateCertificateData }] = createResource(
    () => (domain.state === "ready" ? domain() : undefined),
    async (domain) => {
      return await common.get_certificate_data(domain);
    },
  );

  const search = (text: string) => {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      navigator.storage !== undefined &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      navigator.storage.persist !== undefined
    ) {
      navigator.storage.persist().catch(console.error);
    }

    setSearchQuery({ text, forceUpdateCache: false });

    resetErrorBoundaries();
  };

  const reload = () => {
    const oldQuery = searchQuery();
    if (oldQuery === undefined) return;

    reset();

    setSearchQuery({ text: oldQuery.text, forceUpdateCache: true });
  };

  const reset = () => {
    mutateDomain();
    mutateWhoisData();
    mutateDnssecData();
    mutateCertificateData();
  };

  return (
    <div class="relative flex w-xs flex-col gap-2 sm:w-sm">
      <ErrorBoundary
        fallback={(error: Error) => (
          <div class="bg-container ring-border rounded-lg p-4 ring-1">
            <div class="relative h-8 p-1">
              <Issue lang={props.lang} error={error} />
            </div>
          </div>
        )}
      >
        <SearchBar
          lang={props.lang}
          initValue={initValue()}
          reload={() => {
            reload();
          }}
          search={(text) => {
            search(text);
          }}
        />

        <div class="bg-container ring-border rounded-lg p-4 ring-1">
          <div class="flex flex-col">
            <HeaderDomain lang={props.lang} value={domain()} />

            <AlertBannerCertificate
              lang={props.lang}
              types={certificateData()?.types}
            />

            <div class="flex flex-col gap-1">
              <Section title={i18n("Owner", props.lang)}>
                <SectionItem
                  lang={props.lang}
                  title={i18n("Individual name", props.lang)}
                  description={<>{i18n("Individual name", props.lang)}</>}
                  prefix={<IconUser />}
                  informations={common.merge_informations(
                    certificateData()?.individuals,
                    whoisData()?.individuals,
                  )}
                  suffix={(individual) => (
                    <SourceVerification
                      lang={props.lang}
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
                  lang={props.lang}
                  title={i18n("Organization name", props.lang)}
                  description={<>{i18n("Organization name", props.lang)}</>}
                  prefix={<IconBriefcase />}
                  informations={common.merge_informations(
                    certificateData()?.organizations,
                    whoisData()?.organizations,
                  )}
                  suffix={(organization) => (
                    <SourceVerification
                      lang={props.lang}
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
                  lang={props.lang}
                  title={i18n("Country of residence", props.lang)}
                  description={<>{i18n("Country of residence", props.lang)}</>}
                  prefix={<IconMapPin />}
                  informations={common.merge_informations(
                    certificateData()?.countries,
                    whoisData()?.countries,
                  )}
                  suffix={(country) => (
                    <SourceVerification
                      lang={props.lang}
                      information={country}
                    />
                  )}
                >
                  {(country, index) => (
                    <ListAdditionalItem index={index}>
                      <Country
                        lang={props.lang}
                        value={country.value}
                        type="text"
                      />
                    </ListAdditionalItem>
                  )}
                </SectionItem>
              </Section>

              <Section title={i18n("Domain", props.lang)}>
                <SectionItem
                  lang={props.lang}
                  title={i18n("Registration", props.lang)}
                  description={<>{i18n("Registration", props.lang)}</>}
                  prefix={<IconCalendar1 />}
                  informations={whoisData()?.registrations}
                  suffix={(registration) => (
                    <SourceInfo lang={props.lang} information={registration} />
                  )}
                >
                  {(registration, index) => (
                    <AlertRegistration
                      lang={props.lang}
                      date={registration.value}
                    >
                      <Switch>
                        <Match when={index === 0}>
                          {i18n("Registered", props.lang)}{" "}
                          <DatePastPeriod
                            lang={props.lang}
                            date={registration.value}
                          />
                        </Match>
                        <Match when={true}>
                          {i18n("and", props.lang)}{" "}
                          <DatePastPeriod
                            lang={props.lang}
                            date={registration.value}
                          />
                        </Match>
                      </Switch>
                    </AlertRegistration>
                  )}
                </SectionItem>

                <SectionItem
                  lang={props.lang}
                  title={`${i18n("Protection with", props.lang)} DNSSEC`}
                  description={
                    <>
                      {i18n("Protection with", props.lang)}{" "}
                      <TermDNSSEC lang={props.lang} />
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
                    <SourceInfo lang={props.lang} information={valid} />
                  )}
                >
                  {(valid) => (
                    <Switch>
                      <Match when={valid.value}>
                        {i18n("Protected with", props.lang)}{" "}
                        <TermDNSSEC lang={props.lang} />
                      </Match>
                      <Match when={!valid.value}>
                        {i18n("Not protected with", props.lang)}{" "}
                        <TermDNSSEC lang={props.lang} />
                      </Match>
                    </Switch>
                  )}
                </SectionItem>
              </Section>

              <Section
                title={i18n("Visit", props.lang)}
                suffix={
                  <IssueLink href="#get">
                    {i18n("Only available in the extension", props.lang)}
                  </IssueLink>
                }
              >
                <SectionItemNotAvailable
                  title={i18n("First visit", props.lang)}
                  prefix={<IconCalendar1 />}
                />

                <SectionItemNotAvailable
                  title={i18n("Frequency of visits", props.lang)}
                  prefix={<IconCalendarCheck />}
                />
              </Section>

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
                </Section>
              </Show>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}
