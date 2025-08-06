import * as common from "@istrust/common";
import { CertificateAlert } from "@istrust/ui/alert";
import { Country } from "@istrust/ui/country";
import { DatePastPeriod } from "@istrust/ui/date";
import { HeaderDomain } from "@istrust/ui/header";
import {
  IconBuilding,
  IconCalendar1,
  IconMapPin,
  IconShield,
  IconShieldCheck,
  IconShieldX,
  IconUser,
} from "@istrust/ui/icon";
import { Issue } from "@istrust/ui/issue";
import { ListAdditionalItem } from "@istrust/ui/list";
import { SearchBar } from "@istrust/ui/search";
import { Section, SectionItem } from "@istrust/ui/section";
import { SourceInfo, SourceVerification } from "@istrust/ui/source";
import {
  createResource,
  createSignal,
  ErrorBoundary,
  Match,
  onMount,
  resetErrorBoundaries,
  Switch,
  type Component,
} from "solid-js";

const cache: common.InformationCache = {
  psl: {
    set: async (key: string, value: string) =>
      localStorage.setItem(`psl:${key}`, value),
    get: async (key: string) => {
      const item = localStorage.getItem(`psl:${key}`);
      if (item === null) return;
      return item;
    },
    clear: async () => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === null) continue;

        if (key.startsWith("psl:")) {
          localStorage.removeItem(key);
        }
      }
    },
  },
  rdap: {
    set: async (key: string, value: string) =>
      localStorage.setItem(`rdap:${key}`, value),
    get: async (key: string) => {
      const item = localStorage.getItem(`rdap:${key}`);
      if (item === null) return;
      return item;
    },
    clear: async () => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key === null) continue;

        if (key.startsWith("rdap:")) {
          localStorage.removeItem(key);
        }
      }
    },
  },
};

export const App: Component = () => {
  const [searchQuery, setSearchQuery] = createSignal<{
    text: string;
    forceUpdateCache: boolean;
  }>();

  const [domain, { mutate: mutateDomain }] = createResource(
    searchQuery,
    async (query) => {
      if (query.forceUpdateCache === true) {
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

  const [persisted, setPersisted] = createSignal<boolean>();
  onMount(async () => {
    setPersisted(await navigator.storage.persisted());
  });

  const search = async (text: string) => {
    if (!persisted()) {
      await navigator.storage.persist();
      setPersisted(await navigator.storage.persisted());
    }
    setSearchQuery({ text, forceUpdateCache: false });

    resetErrorBoundaries();
  };

  const reload = async () => {
    const oldQuery = searchQuery();
    if (oldQuery === undefined) return;

    mutateDomain();
    mutateWhoisData();
    mutateDnssecData();
    mutateCertificateData();

    setSearchQuery({ text: oldQuery.text, forceUpdateCache: true });
  };

  return (
    <div class="bg-background flex min-h-screen items-center justify-center">
      <div class="flex w-sm flex-col gap-2 p-4">
        <SearchBar
          reload={() => reload()}
          search={(text) => {
            search(text);
          }}
        />

        <div class="bg-container ring-border rounded-lg p-4 ring-1">
          <ErrorBoundary
            fallback={(error) => (
              <Issue
                scope="istrust.org"
                query={searchQuery()?.text || ""}
                error={error}
              />
            )}
          >
            <div class="flex flex-col">
              <HeaderDomain value={domain()} />

              <CertificateAlert types={certificateData()?.types} />

              <div class="flex flex-col gap-1">
                <Section title="Owner">
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
                        locale={navigator.language}
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
                        locale={navigator.language}
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
                        locale={navigator.language}
                      />
                    )}
                  >
                    {(country, index) => (
                      <ListAdditionalItem index={index}>
                        <Country
                          value={country.value}
                          locale={navigator.language}
                          type="text"
                        />
                      </ListAdditionalItem>
                    )}
                  </SectionItem>
                </Section>

                <Section title="Domain">
                  <SectionItem
                    description="Registration"
                    prefix={<IconCalendar1 />}
                    informations={whoisData()?.registrations}
                    suffix={(registration) => (
                      <SourceInfo
                        information={registration}
                        locale={navigator.language}
                      />
                    )}
                  >
                    {(registration, index) => (
                      <Switch>
                        <Match when={index === 0}>
                          Registered{" "}
                          <DatePastPeriod date={registration.value} />
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
                      <Switch>
                        <Match when={dnssecData()?.valid?.value === true}>
                          <IconShieldCheck />
                        </Match>
                        <Match when={dnssecData()?.valid?.value === false}>
                          <IconShieldX />
                        </Match>
                        <Match when={true}>
                          <IconShield />
                        </Match>
                      </Switch>
                    }
                    informations={dnssecData()?.valid}
                    suffix={(valid) => (
                      <SourceInfo
                        information={valid}
                        locale={navigator.language}
                      />
                    )}
                  >
                    {(valid) => (
                      <Switch>
                        <Match when={valid.value === true}>
                          Protected with DNSSEC
                        </Match>
                        <Match when={valid.value === false}>
                          Not protected with DNSSEC
                        </Match>
                      </Switch>
                    )}
                  </SectionItem>
                </Section>

                {/* <Section title="Debug">
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
                </Section> */}
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
