import * as common from "@istrust/common";
import i18n from "@istrust/i18n";
import { CertificateAlert } from "@istrust/ui/alert/index";
import { Country } from "@istrust/ui/country/index";
import { DatePastPeriod } from "@istrust/ui/date/index";
import { HeaderDomain } from "@istrust/ui/header/index";
import {
  IconBuilding,
  IconCalendar1,
  IconCalendarCheck,
  IconMapPin,
  IconShield,
  IconShieldCheck,
  IconShieldX,
  IconUser,
} from "@istrust/ui/icon/index";
import { Issue } from "@istrust/ui/issue/index";
import { ListAdditionalItem } from "@istrust/ui/list/index";
import { SearchBar } from "@istrust/ui/search/index";
import {
  Section,
  SectionItem,
  SectionItemOnlyAvailableIn,
} from "@istrust/ui/section/index";
import { SourceInfo, SourceVerification } from "@istrust/ui/source/index";
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

      return await common.get_effective_domain(query.text, cache);
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
    void navigator.storage.persist();

    setSearchQuery({ text, forceUpdateCache: false });

    resetErrorBoundaries();
  };

  const reload = () => {
    const oldQuery = searchQuery();
    if (oldQuery === undefined) return;

    mutateDomain();
    mutateWhoisData();
    mutateDnssecData();
    mutateCertificateData();

    setSearchQuery({ text: oldQuery.text, forceUpdateCache: true });
  };

  return (
    <div class="relative flex w-xs flex-col gap-2 sm:w-sm">
      <ErrorBoundary fallback={(error: Error) => <Issue error={error} />}>
        <SearchBar
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
            <HeaderDomain value={domain()} />

            <CertificateAlert types={certificateData()?.types} />

            <div class="flex flex-col gap-1">
              <Section title={i18n("Owner", { lang: props.lang })}>
                <SectionItem
                  description="Individual name"
                  prefix={<IconUser />}
                  informations={common.merge_informations(
                    certificateData()?.individuals,
                    whoisData()?.individuals,
                  )}
                  suffix={(individual) => (
                    <SourceVerification
                      information={individual}
                      lang={props.lang}
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
                  description="Organization name"
                  prefix={<IconBuilding />}
                  informations={common.merge_informations(
                    certificateData()?.organizations,
                    whoisData()?.organizations,
                  )}
                  suffix={(organization) => (
                    <SourceVerification
                      information={organization}
                      lang={props.lang}
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
                  description="Country of residence"
                  prefix={<IconMapPin />}
                  informations={common.merge_informations(
                    certificateData()?.countries,
                    whoisData()?.countries,
                  )}
                  suffix={(country) => (
                    <SourceVerification
                      information={country}
                      lang={props.lang}
                    />
                  )}
                >
                  {(country, index) => (
                    <ListAdditionalItem index={index}>
                      <Country
                        value={country.value}
                        type="text"
                        lang={props.lang}
                      />
                    </ListAdditionalItem>
                  )}
                </SectionItem>
              </Section>

              <Section title={i18n("Domain", { lang: props.lang })}>
                <SectionItem
                  description="Registration"
                  prefix={<IconCalendar1 />}
                  informations={whoisData()?.registrations}
                  suffix={(registration) => (
                    <SourceInfo information={registration} lang={props.lang} />
                  )}
                >
                  {(registration, index) => (
                    <Switch>
                      <Match when={index === 0}>
                        Registered <DatePastPeriod date={registration.value} />
                      </Match>
                      <Match when={true}>
                        and <DatePastPeriod date={registration.value} />
                      </Match>
                    </Switch>
                  )}
                </SectionItem>

                <SectionItem
                  description="Protection (DNSSEC)"
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
                    <SourceInfo information={valid} lang={props.lang} />
                  )}
                >
                  {(valid) => (
                    <Switch>
                      <Match when={valid.value}>Protected with DNSSEC</Match>
                      <Match when={!valid.value}>
                        Not protected with DNSSEC
                      </Match>
                    </Switch>
                  )}
                </SectionItem>
              </Section>

              <Section title={i18n("Visit", { lang: props.lang })}>
                <SectionItemOnlyAvailableIn
                  platform="webextension"
                  description="First visit"
                  prefix={<IconCalendar1 />}
                />

                <SectionItemOnlyAvailableIn
                  platform="webextension"
                  description="Frequency of visits"
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
