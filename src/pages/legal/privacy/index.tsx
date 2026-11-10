import { useTranslation, Trans } from 'react-i18next'
export default function PrivacyPolicy() {
  const { t } = useTranslation()
  return (
    <>
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 id="privacy">{t('privacyPolicy', 'Privacy Policy')}</h1>
        <p>{t('lastUpdatedSeptember292026', 'Last updated: September 29, 2026')}</p>
        <p>
          {t('thisPrivacyPolicyDescribesOurPoliciesAndProceduresOnTheCollectionUseAndDisclosureOfYourInformationWhenYouUseTheServiceAndTellsYouAboutYourPrivacyRightsAndHowTheLawProtectsYou', 'This Privacy Policy describes Our policies and procedures on the\n          collection, use and disclosure of Your information when You use the\n          Service and tells You about Your privacy rights and how the law\n          protects You.')}
        </p>
        <p>
          {t('weUseYourPersonalDataToProvideAndImproveTheServiceWeCollectUseAndDiscloseYourInformationAsDescribedInThisPrivacyPolicyAndWhereRequiredByApplicableLawOnlyWhereWeHaveAValidLegalBasisToDoSoIncludingYourConsentWhereConsentIsRequiredThisPrivacyPolicyHasBeenCreatedWithTheHelpOfThe', 'We use Your Personal Data to provide and improve the Service. We\n          collect, use, and disclose Your information as described in this\n          Privacy Policy and, where required by applicable law, only where We\n          have a valid legal basis to do so, including Your consent (where\n          consent is required). This Privacy Policy has been created with the\n          help of the')}{" "}<Trans i18nKey="aHrefhttpswwwtermsfeedcomprivacypolicygeneratorTarget_blankPrivacyPolicyGeneratorA"><a
            href="https://www.termsfeed.com/privacy-policy-generator/"
            target="_blank"
          >
            Privacy Policy Generator
          </a>
          .</Trans></p>
        <h2 id="privacy">{t('interpretationAndDefinitions', 'Interpretation and Definitions')}</h2>
        <h3 id="privacy">{t('interpretation', 'Interpretation')}</h3>
        <p>
          {t('theWordsWhoseInitialLettersAreCapitalizedHaveMeaningsDefinedUnderTheFollowingConditionsTheFollowingDefinitionsShallHaveTheSameMeaningRegardlessOfWhetherTheyAppearInSingularOrInPlural', 'The words whose initial letters are capitalized have meanings defined\n          under the following conditions. The following definitions shall have\n          the same meaning regardless of whether they appear in singular or in\n          plural.')}
        </p>
        <h3 id="privacy">{t('definitions', 'Definitions')}</h3>
        <p>{t('forThePurposesOfThisPrivacyPolicy', 'For the purposes of this Privacy Policy:')}</p>
        <ul>
          <li>
            <p><Trans i18nKey="strongaccountstrongMeansAUniqueAccountCreatedForYouToAccessOurServiceOrPartsOfOurService"><strong>Account</strong> means a unique account created for You to
              access Our Service or parts of Our Service.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongaffiliatestrongMeansAnEntityThatControlsIsControlledByOrIsUnderCommonControlWithAPartyWhereQuotcontrolquotMeansOwnershipOf50OrMoreOfTheSharesEquityInterestOrOtherSecuritiesEntitledToVoteForElectionOfDirectorsOrOtherManagingAuthority"><strong>Affiliate</strong> means an entity that controls, is
              controlled by, or is under common control with a party, where
              &quot;control&quot; means ownership of 50% or more of the shares,
              equity interest or other securities entitled to vote for election
              of directors or other managing authority.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongcompanystrongReferredToAsEitherQuottheCompanyquotQuotwequotQuotusquotOrQuotourquotInThisPrivacyPolicyRefersToRaidersio"><strong>Company</strong> (referred to as either &quot;the
              Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot;
              in this Privacy Policy) refers to Raiders-io.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongcookiesstrongAreSmallFilesThatArePlacedOnYourComputerMobileDeviceOrAnyOtherDeviceByAWebsiteContainingTheDetailsOfYourBrowsingHistoryOnThatWebsiteAmongItsManyUses"><strong>Cookies</strong> are small files that are placed on Your
              computer, mobile device or any other device by a website,
              containing the details of Your browsing history on that website,
              among its many uses.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongcountrystatestrongRefersToFrance"><strong>Country/State</strong> refers to: France.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongdevicestrongMeansAnyDeviceThatCanAccessTheServiceSuchAsAComputerACellPhoneOrADigitalTablet"><strong>Device</strong> means any device that can access the
              Service, such as a computer, a cell phone or a digital tablet.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongpersonalDatastrongOrQuotpersonalInformationquotIsAnyInformationThatRelatesToAnIdentifiedOrIdentifiableIndividual"><strong>Personal Data</strong> (or &quot;Personal
              Information&quot;) is any information that relates to an
              identified or identifiable individual.</Trans></p>
            <p>
              {t('weUseQuotpersonalDataquotAndQuotpersonalInformationquotInterchangeablyUnlessALawUsesASpecificTerm', 'We use &quot;Personal Data&quot; and &quot;Personal\n              Information&quot; interchangeably unless a law uses a specific\n              term.')}
            </p>
          </li>
          <li>
            <p><Trans i18nKey="strongservicestrongRefersToTheWebsite"><strong>Service</strong> refers to the Website.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongserviceProviderstrongMeansAnyNaturalOrLegalPersonWhoProcessesTheDataOnBehalfOfTheCompanyItRefersToThirdpartyCompaniesOrIndividualsEmployedByTheCompanyToFacilitateTheServiceToProvideTheServiceOnBehalfOfTheCompanyToPerformServicesRelatedToTheServiceOrToAssistTheCompanyInAnalyzingHowTheServiceIsUsed"><strong>Service Provider</strong> means any natural or legal
              person who processes the data on behalf of the Company. It refers
              to third-party companies or individuals employed by the Company to
              facilitate the Service, to provide the Service on behalf of the
              Company, to perform services related to the Service or to assist
              the Company in analyzing how the Service is used.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongusageDatastrongRefersToDataCollectedAutomaticallyEitherGeneratedByTheUseOfTheServiceOrFromTheServiceInfrastructureItselfForExampleTheDurationOfAPageVisit"><strong>Usage Data</strong> refers to data collected
              automatically, either generated by the use of the Service or from
              the Service infrastructure itself (for example, the duration of a
              page visit).</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="stronguserstrongMeansAnyIndividualWhoAccessesOrUsesTheService"><strong>User</strong> means any individual who accesses or uses
              the Service.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongwebsitestrongRefersToRaidersioAccessibleFrom"><strong>Website</strong> refers to Raiders-io, accessible from</Trans>{" "}
              <a
                href="https://Raiders.io/"
                rel="external nofollow noopener"
                target="_blank"
              >
                https://Raiders.io/
              </a>
              .
            </p>
          </li>
          <li>
            <p><Trans i18nKey="strongyoustrongMeansTheIndividualAccessingOrUsingTheServiceOrTheCompanyOrOtherLegalEntityOnBehalfOfWhichSuchIndividualIsAccessingOrUsingTheServiceAsApplicable"><strong>You</strong> means the individual accessing or using the
              Service, or the company, or other legal entity on behalf of which
              such individual is accessing or using the Service, as applicable.</Trans></p>
          </li>
        </ul>
        <h2 id="privacy">{t('collectingAndUsingYourPersonalInformation', 'Collecting and Using Your Personal Information')}</h2>
        <h3 id="privacy">{t('typesOfDataCollected', 'Types of Data Collected')}</h3>
        <h4 id="privacy">{t('personalData', 'Personal Data')}</h4>
        <p>
          {t('whileUsingOurServiceWeMayAskYouToProvideUsWithCertainPersonallyIdentifiableInformationThatCanBeUsedToContactOrIdentifyYouPersonallyIdentifiableInformationMayIncludeButIsNotLimitedTo', 'While using Our Service, We may ask You to provide Us with certain\n          personally identifiable information that can be used to contact or\n          identify You. Personally identifiable information may include, but is\n          not limited to:')}
        </p>
        <ul>
          <li>{t('emailAddress', 'Email address')}</li>
          <li>{t('firstNameAndLastName', 'First name and last name')}</li>
        </ul>
        <h4 id="privacy">{t('usageData', 'Usage Data')}</h4>
        <p>{t('usageDataIsCollectedAutomaticallyWhenUsingTheService', 'Usage Data is collected automatically when using the Service.')}</p>
        <p>
          {t('usageDataMayIncludeInformationSuchAsYourDevicesInternetProtocolAddressEgIpAddressBrowserTypeBrowserVersionThePagesOfOurServiceThatYouVisitTheTimeAndDateOfYourVisitTheTimeSpentOnThosePagesUniqueDeviceIdentifiersAndOtherDiagnosticData', 'Usage Data may include information such as Your Device\'s Internet\n          Protocol address (e.g. IP address), browser type, browser version, the\n          pages of Our Service that You visit, the time and date of Your visit,\n          the time spent on those pages, unique device identifiers and other\n          diagnostic data.')}
        </p>
        <p>
          {t('whenYouAccessTheServiceByOrThroughAMobileDeviceWeMayCollectCertainInformationAutomaticallyIncludingButNotLimitedToTheTypeOfMobileDeviceYouUseYourMobileDevicesUniqueIdTheIpAddressOfYourMobileDeviceYourMobileOperatingSystemTheTypeOfMobileInternetBrowserYouUseUniqueDeviceIdentifiersAndOtherDiagnosticData', 'When You access the Service by or through a mobile device, We may\n          collect certain information automatically, including, but not limited\n          to, the type of mobile device You use, Your mobile device\'s unique ID,\n          the IP address of Your mobile device, Your mobile operating system,\n          the type of mobile Internet browser You use, unique device identifiers\n          and other diagnostic data.')}
        </p>
        <p>
          {t('weMayAlsoCollectInformationThatYourBrowserSendsWheneverYouVisitOurServiceOrWhenYouAccessTheServiceByOrThroughAMobileDevice', 'We may also collect information that Your browser sends whenever You\n          visit Our Service or when You access the Service by or through a\n          mobile device.')}
        </p>
        <h4 id="privacy">{t('trackingTechnologiesAndCookies', 'Tracking Technologies and Cookies')}</h4>
        <p>
          {t('weUseTrackingTechnologiesSuchAsCookiesToTrackTheActivityAndToImproveOurServiceTheTechnologiesWeUseMayInclude', 'We use tracking technologies (such as cookies) to track the activity\n          and to improve Our Service. The technologies We use may include:')}
        </p>
        <ul>
          <li><Trans i18nKey="strongcookiesOrBrowserCookiesstrongACookieIsASmallFilePlacedOnYourDeviceYouCanInstructYourBrowserToRefuseAllCookiesOrToIndicateWhenACookieIsBeingSentHoweverIfYouDoNotAcceptCookiesYouMayNotBeAbleToUseSomePartsOfOurService"><strong>Cookies or Browser Cookies.</strong> A cookie is a small
            file placed on Your Device. You can instruct Your browser to refuse
            all Cookies or to indicate when a Cookie is being sent. However, if
            You do not accept Cookies, You may not be able to use some parts of
            Our Service.</Trans></li>
          <li><Trans i18nKey="strongwebBeaconsstrongCertainSectionsOfOurServiceMayContainSmallElectronicFilesKnownAsWebBeaconsAlsoReferredToAsClearGifsPixelTagsAndSinglepixelGifsThatPermitTheCompanyForExampleToCountUsersWhoHaveVisitedThosePagesAndForOtherRelatedWebsiteStatisticsForExampleRecordingThePopularityOfACertainSectionAndVerifyingSystemAndServerIntegrity"><strong>Web Beacons.</strong> Certain sections of Our Service may
            contain small electronic files known as web beacons (also referred
            to as clear gifs, pixel tags, and single-pixel gifs) that permit the
            Company, for example, to count users who have visited those pages
            and for other related website statistics (for example, recording the
            popularity of a certain section and verifying system and server
            integrity).</Trans></li>
        </ul>
        <p>
          {t('cookiesCanBeQuotpersistentquotOrQuotsessionquotCookiesPersistentCookiesRemainOnYourPersonalComputerOrMobileDeviceWhenYouGoOfflineWhileSessionCookiesAreDeletedAsSoonAsYouCloseYourWebBrowser', 'Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies.\n          Persistent Cookies remain on Your personal computer or mobile device\n          when You go offline, while Session Cookies are deleted as soon as You\n          close Your web browser.')}
        </p>
        <p>
          {t('whereRequiredByLawWeUseNonessentialCookiesThatIsCookiesOtherThanTheNecessaryEssentialCookiesDescribedBelowOnlyWithYourConsentYouCanWithdrawOrChangeYourConsentAtAnyTimeUsingOurCookiePreferencesToolIfAvailableOrThroughYourBrowserdeviceSettingsWithdrawingConsentDoesNotAffectTheLawfulnessOfProcessingBasedOnConsentBeforeItsWithdrawal', 'Where required by law, We use non-essential cookies (that is, Cookies\n          other than the Necessary / Essential Cookies described below) only\n          with Your consent. You can withdraw or change Your consent at any time\n          using Our cookie preferences tool (if available) or through Your\n          browser/device settings. Withdrawing consent does not affect the\n          lawfulness of processing based on consent before its withdrawal.')}
        </p>
        <p>
          {t('weUseBothSessionAndPersistentCookiesForThePurposesSetOutBelow', 'We use both Session and Persistent Cookies for the purposes set out\n          below:')}
        </p>
        <ul>
          <li>
            <p>
              <strong>{t('necessaryEssentialCookies', 'Necessary / Essential Cookies')}</strong>
            </p>
            <p>{t('typeSessionCookies', 'Type: Session Cookies')}</p>
            <p>{t('administeredByUs', 'Administered by: Us')}</p>
            <p>
              {t('purposeTheseCookiesAreEssentialToProvideYouWithServicesAvailableThroughTheWebsiteAndToEnableYouToUseSomeOfItsFeaturesTheyHelpToAuthenticateUsersAndPreventFraudulentUseOfUserAccountsWithoutTheseCookiesTheServicesThatYouHaveAskedForCannotBeProvidedAndWeOnlyUseTheseCookiesToProvideYouWithThoseServices', 'Purpose: These Cookies are essential to provide You with services\n              available through the Website and to enable You to use some of its\n              features. They help to authenticate users and prevent fraudulent\n              use of user accounts. Without these Cookies, the services that You\n              have asked for cannot be provided, and We only use these Cookies\n              to provide You with those services.')}
            </p>
          </li>
          <li>
            <p>
              <strong>{t('cookiesPolicyNoticeAcceptanceCookies', 'Cookies Policy / Notice Acceptance Cookies')}</strong>
            </p>
            <p>{t('typePersistentCookies', 'Type: Persistent Cookies')}</p>
            <p>{t('administeredByUs', 'Administered by: Us')}</p>
            <p>
              {t('purposeTheseCookiesIdentifyWhetherUsersHaveAcceptedTheUseOfCookiesOnTheWebsiteAndRecordTheConsentChoicesYouHaveMadeSoThatWeCanHonorThoseChoicesOnFutureVisits', 'Purpose: These Cookies identify whether users have accepted the\n              use of cookies on the Website and record the consent choices You\n              have made, so that We can honor those choices on future visits.')}
            </p>
          </li>
          <li>
            <p>
              <strong>{t('functionalityCookies', 'Functionality Cookies')}</strong>
            </p>
            <p>{t('typePersistentCookies', 'Type: Persistent Cookies')}</p>
            <p>{t('administeredByUs', 'Administered by: Us')}</p>
            <p>
              {t('purposeTheseCookiesAllowUsToRememberChoicesYouMakeWhenYouUseTheWebsiteSuchAsRememberingYourAccountLoginDetailsOrLanguagePreferenceThePurposeOfTheseCookiesIsToProvideYouWithAMorePersonalExperienceAndToAvoidYouHavingToReenterYourPreferencesEveryTimeYouUseTheWebsite', 'Purpose: These Cookies allow Us to remember choices You make when\n              You use the Website, such as remembering Your Account login\n              details or language preference. The purpose of these Cookies is to\n              provide You with a more personal experience and to avoid You\n              having to re-enter Your preferences every time You use the\n              Website.')}
            </p>
          </li>
        </ul>
        <h3 id="privacy">{t('useOfYourPersonalData', 'Use of Your Personal Data')}</h3>
        <p>{t('theCompanyMayUsePersonalDataForTheFollowingPurposes', 'The Company may use Personal Data for the following purposes:')}</p>
        <ul>
          <li>
            <p><Trans i18nKey="strongtoProvideAndMaintainOurServicestrongIncludingToMonitorTheUsageOfOurService"><strong>To provide and maintain Our Service</strong>, including to
              monitor the usage of Our Service.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongtoManageYourAccountstrongToManageYourRegistrationAsAUserOfTheServiceThePersonalDataYouProvideCanGiveYouAccessToDifferentFunctionalitiesOfTheServiceThatAreAvailableToYouAsARegisteredUser"><strong>To manage Your Account:</strong> to manage Your
              registration as a user of the Service. The Personal Data You
              provide can give You access to different functionalities of the
              Service that are available to You as a registered user.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongforThePerformanceOfAContractstrongTheDevelopmentComplianceAndUndertakingOfThePurchaseContractForTheProductsItemsOrServicesYouHavePurchasedOrOfAnyOtherContractWithUsThroughTheService"><strong>For the performance of a contract:</strong> the
              development, compliance and undertaking of the purchase contract
              for the products, items or services You have purchased or of any
              other contract with Us through the Service.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongtoContactYoustrongToContactYouByEmailTelephoneCallsSmsOrOtherEquivalentFormsOfElectronicCommunicationSuchAsAMobileApplicationsPushNotificationsRegardingUpdatesOrInformativeCommunicationsRelatedToTheFunctionalitiesProductsOrContractedServicesIncludingTheSecurityUpdatesWhenNecessaryOrReasonableForTheirImplementation"><strong>To contact You:</strong> To contact You by email,
              telephone calls, SMS, or other equivalent forms of electronic
              communication, such as a mobile application's push notifications
              regarding updates or informative communications related to the
              functionalities, products or contracted services, including the
              security updates, when necessary or reasonable for their
              implementation.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongtoProvideYoustrongWithNewsSpecialOffersAndGeneralInformationAboutOtherGoodsServicesAndEventsWhichWeOfferThatAreSimilarToThoseThatYouHaveAlreadyPurchasedOrInquiredAboutWeSendSuchMarketingCommunicationsOnlyWherePermittedByApplicableLawWherePriorConsentIsRequiredForExampleUnderTheLawsApplicableInTheEeaAndTheUkWeWillSendThemOnlyWithYourConsentOtherwiseWeMaySendThemUntilYouOptOutYouMayOptOutOrWithdrawYourConsentAtAnyTimeByUsingTheUnsubscribeLinkInAnyMarketingEmailWeSendOrByContactingUs"><strong>To provide You</strong> with news, special offers, and
              general information about other goods, services and events which
              We offer that are similar to those that You have already purchased
              or inquired about. We send such marketing communications only
              where permitted by applicable law: where prior consent is required
              (for example, under the laws applicable in the EEA and the UK), We
              will send them only with Your consent; otherwise, We may send them
              until You opt out. You may opt out or withdraw Your consent at any
              time by using the unsubscribe link in any marketing email We send
              or by contacting Us.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongtoManageYourRequestsstrongToAttendAndManageYourRequestsToUs"><strong>To manage Your requests:</strong> To attend and manage
              Your requests to Us.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongforBusinessTransfersstrongWeMayUseYourPersonalDataToEvaluateOrConductAMergerDivestitureRestructuringReorganizationDissolutionOrOtherSaleOrTransferOfSomeOrAllOfOurAssetsWhetherAsAGoingConcernOrAsPartOfBankruptcyLiquidationOrSimilarProceedingInWhichPersonalDataHeldByUsAboutOurServiceUsersIsAmongTheAssetsTransferred"><strong>For business transfers:</strong> We may use Your Personal
              Data to evaluate or conduct a merger, divestiture, restructuring,
              reorganization, dissolution, or other sale or transfer of some or
              all of Our assets, whether as a going concern or as part of
              bankruptcy, liquidation, or similar proceeding, in which Personal
              Data held by Us about Our Service users is among the assets
              transferred.</Trans></p>
          </li>
          <li>
            <p><Trans i18nKey="strongforOtherPurposesstrongWeMayUseYourInformationForOtherPurposesSuchAsDataAnalysisIdentifyingUsageTrendsDeterminingTheEffectivenessOfOurPromotionalCampaignsAndEvaluatingAndImprovingOurServiceProductsServicesMarketingAndYourExperience"><strong>For other purposes</strong>: We may use Your information
              for other purposes, such as data analysis, identifying usage
              trends, determining the effectiveness of Our promotional
              campaigns, and evaluating and improving Our Service, products,
              services, marketing and Your experience.</Trans></p>
          </li>
        </ul>
        <p>{t('weMayShareYourPersonalDataInTheFollowingSituations', 'We may share Your Personal Data in the following situations:')}</p>
        <ul>
          <li><Trans i18nKey="strongwithServiceProvidersstrongWeMayShareYourPersonalDataWithServiceProvidersToMonitorAndAnalyzeTheUseOfOurServiceAndToContactYou"><strong>With Service Providers:</strong> We may share Your Personal
            Data with Service Providers to monitor and analyze the use of Our
            Service, and to contact You.</Trans></li>
          <li><Trans i18nKey="strongforBusinessTransfersstrongWeMayShareOrTransferYourPersonalDataInConnectionWithOrDuringNegotiationsOfAnyMergerSaleOfCompanyAssetsFinancingOrAcquisitionOfAllOrAPortionOfOurBusinessToAnotherCompany"><strong>For business transfers:</strong> We may share or transfer
            Your Personal Data in connection with, or during negotiations of,
            any merger, sale of Company assets, financing, or acquisition of all
            or a portion of Our business to another company.</Trans></li>
          <li><Trans i18nKey="strongwithAffiliatesstrongWeMayShareYourPersonalDataWithOurAffiliatesInWhichCaseWeWillRequireThoseAffiliatesToHonorThisPrivacyPolicyAffiliatesIncludeOurParentCompanyAndAnyOtherSubsidiariesJointVenturePartnersOrOtherCompaniesThatWeControlOrThatAreUnderCommonControlWithUs"><strong>With Affiliates:</strong> We may share Your Personal Data
            with Our affiliates, in which case We will require those affiliates
            to honor this Privacy Policy. Affiliates include Our parent company
            and any other subsidiaries, joint venture partners or other
            companies that We control or that are under common control with Us.</Trans></li>
          <li><Trans i18nKey="strongwithOtherUsersstrongIfOurServiceOffersPublicAreasWhenYouSharePersonalDataOrOtherwiseInteractInThePublicAreasWithOtherUsersSuchInformationMayBeViewedByAllUsersAndMayBePubliclyDistributedOutsideTheService"><strong>With other users:</strong> If Our Service offers public
            areas, when You share Personal Data or otherwise interact in the
            public areas with other users, such information may be viewed by all
            users and may be publicly distributed outside the Service.</Trans></li>
          <li><Trans i18nKey="strongwithYourConsentstrongWeMayDiscloseYourPersonalDataForAnyOtherPurposeWithYourConsent"><strong>With Your consent</strong>: We may disclose Your Personal
            Data for any other purpose with Your consent.</Trans></li>
        </ul>
        <h4 id="privacy">{t('textMessagesPrivacyNotice', 'Text Messages Privacy Notice')}</h4>
        <p>
          {t('youHaveTheOptionToReceiveTextSmsMessagesFromUsIfYouOptInToTextMessagesWeWillSendYouUpdatesNotificationsAndOtherCommunicationsAsDescribedBelowWhenYouOptInWeWillCollectAndStoreTheInformationYouProvideInConnectionWithTextMessagingSuchAsYourPhoneNumberTheDateAndMethodOfYourConsentAndMessageDeliveryAndReadInformation', 'You have the option to receive text (SMS) messages from Us. If You opt\n          in to text messages, We will send You updates, notifications, and\n          other communications as described below. When You opt in, We will\n          collect and store the information You provide in connection with text\n          messaging, such as Your phone number, the date and method of Your\n          consent, and message delivery and read information.')}
        </p>
        <p>
          {t('noMobileInformationWillBeSharedWithOrSoldToThirdPartiesOrAffiliatesForMarketingOrPromotionalPurposesThePhoneNumbersAndConsentRecordsWeCollectForTextingAreNeverSharedWithAnyoneForAnyPurposeExceptTheServiceProvidersThatTechnicallyHaveToHandleThemToDeliverTheTexts', 'No mobile information will be shared with or sold to third parties or\n          affiliates for marketing or promotional purposes. The phone numbers\n          and consent records We collect for texting are never shared with\n          anyone for any purpose, except the Service Providers that technically\n          have to handle them to deliver the texts.')}
        </p>
        <p>
          {t('consentToReceiveTextMessagesIsNotAConditionOfAnyPurchaseOrUseOfOurServiceIfYouConsentToReceiveSmsFromUsYouAgreeToReceiveTextMessagesFromUsRelatedTo', 'Consent to receive text messages is not a condition of any purchase or\n          use of Our Service. If You consent to receive SMS from Us, You agree\n          to receive text messages from Us related to:')}
        </p>
        <ul>
          <li>{t('customerCareAndSupport', 'Customer care and support')}</li>
          <li>
            {t('accountNotificationsSuchAsActivityStatusOrRenewalReminders', 'Account notifications, such as activity, status, or renewal\n            reminders')}
          </li>
          <li>
            {t('deliveryNotificationsAndUpdatesOnTheStatusOfADelivery', 'Delivery notifications and updates on the status of a delivery')}
          </li>
          <li>
            {t('authenticationMessagesSuchAsOnetimePasswordsOtpAndPasscodes', 'Authentication messages, such as one-time passwords (OTP) and\n            passcodes')}
          </li>
          <li>
            {t('securityAlertsSuchAsSuspiciousLoginAttemptsOrUnusualAccountActivity', 'Security alerts, such as suspicious login attempts or unusual\n            account activity')}
          </li>
          <li>
            {t('marketingAndPromotionalOffersDiscountsAndOtherPromotionalContent', 'Marketing and promotional offers, discounts, and other promotional\n            content')}
          </li>
        </ul>
        <p>
          {t('replyStopToOptoutReplyHelpForSupportMessageAmpDataRatesMayApplyMessagingFrequencyMayVaryCarriersAreNotLiableForDelayedOrUndeliveredMessages', 'Reply STOP to opt-out. Reply HELP for support. Message &amp; data\n          rates may apply. Messaging frequency may vary. Carriers are not liable\n          for delayed or undelivered messages.')}
        </p>
        <h3 id="privacy">{t('retentionOfYourPersonalData', 'Retention of Your Personal Data')}</h3>
        <p>
          {t('theCompanyWillRetainYourPersonalDataOnlyForAsLongAsIsNecessaryForThePurposesSetOutInThisPrivacyPolicyWeWillRetainAndUseYourPersonalDataToTheExtentNecessaryToComplyWithOurLegalObligationsForExampleIfWeAreRequiredToRetainYourDataToComplyWithApplicableLawsResolveDisputesAndEnforceOurLegalAgreementsAndPolicies', 'The Company will retain Your Personal Data only for as long as is\n          necessary for the purposes set out in this Privacy Policy. We will\n          retain and use Your Personal Data to the extent necessary to comply\n          with Our legal obligations (for example, if We are required to retain\n          Your data to comply with applicable laws), resolve disputes, and\n          enforce Our legal agreements and policies.')}
        </p>
        <p>
          {t('wherePossibleWeApplyShorterRetentionPeriodsAndorReduceIdentifiabilityByDeletingAggregatingOrAnonymizingDataUnlessOtherwiseStatedTheRetentionPeriodsBelowAreMaximumPeriodsQuotupToquotAndWeMayDeleteOrAnonymizeDataSoonerWhenItIsNoLongerNeededForTheRelevantPurposeWeApplyDifferentRetentionPeriodsToDifferentCategoriesOfPersonalDataBasedOnThePurposeOfProcessingAndLegalObligations', 'Where possible, We apply shorter retention periods and/or reduce\n          identifiability by deleting, aggregating, or anonymizing data. Unless\n          otherwise stated, the retention periods below are maximum periods\n          (&quot;up to&quot;) and We may delete or anonymize data sooner when it\n          is no longer needed for the relevant purpose. We apply different\n          retention periods to different categories of Personal Data based on\n          the purpose of processing and legal obligations:')}
        </p>
        <ul>
          <li>
            <p>{t('accountInformation', 'Account Information')}</p>
            <ul>
              <li>
                {t('userAccountsRetainedForTheDurationOfYourAccountRelationshipPlusUpTo24MonthsAfterAccountClosureToHandleAnyPostterminationIssuesOrResolveDisputes', 'User Accounts: retained for the duration of Your Account\n                relationship plus up to 24 months after account closure to\n                handle any post-termination issues or resolve disputes.')}
              </li>
            </ul>
          </li>
          <li>
            <p>{t('customerSupportData', 'Customer Support Data')}</p>
            <ul>
              <li>
                {t('supportTicketsAndCorrespondenceUpTo24MonthsFromTheDateOfTicketClosureToResolveFollowupInquiriesTrackServiceQualityAndDefendAgainstPotentialLegalClaims', 'Support tickets and correspondence: up to 24 months from the\n                date of ticket closure to resolve follow-up inquiries, track\n                service quality, and defend against potential legal claims.')}
              </li>
              <li>
                {t('chatTranscriptsUpTo24MonthsForQualityAssuranceAndStaffTrainingPurposes', 'Chat transcripts: up to 24 months for quality assurance and\n                staff training purposes.')}
              </li>
            </ul>
          </li>
          <li>
            <p>{t('usageData', 'Usage Data')}</p>
            <ul>
              <li>
                <p>
                  {t('websiteAnalyticsDataCookiesIpAddressesDeviceIdentifiersUpTo24MonthsFromTheDateOfCollectionWhichAllowsUsToAnalyzeTrendsWhileRespectingPrivacyPrinciples', 'Website analytics data (cookies, IP addresses, device\n                  identifiers): up to 24 months from the date of collection,\n                  which allows us to analyze trends while respecting privacy\n                  principles.')}
                </p>
              </li>
              <li>
                <p>
                  {t('serverLogsIpAddressesAccessTimesUpTo24MonthsForSecurityMonitoringAndTroubleshootingPurposes', 'Server logs (IP addresses, access times): up to 24 months for\n                  security monitoring and troubleshooting purposes.')}
                </p>
              </li>
            </ul>
          </li>
        </ul>
        <p>
          {t('usageDataIsRetainedInAccordanceWithTheRetentionPeriodsDescribedAboveAndMayBeRetainedLongerOnlyWhereNecessaryForSecurityFraudPreventionOrLegalCompliance', 'Usage Data is retained in accordance with the retention periods\n          described above, and may be retained longer only where necessary for\n          security, fraud prevention, or legal compliance.')}
        </p>
        <p>
          {t('weMayRetainPersonalDataBeyondThePeriodsStatedAboveForDifferentReasons', 'We may retain Personal Data beyond the periods stated above for\n          different reasons:')}
        </p>
        <ul>
          <li>
            {t('legalObligationWeAreRequiredByLawToRetainSpecificDataEgFinancialRecordsForTaxAuthorities', 'Legal obligation: We are required by law to retain specific data\n            (e.g., financial records for tax authorities).')}
          </li>
          <li>
            {t('legalClaimsDataIsNecessaryToEstablishExerciseOrDefendLegalClaims', 'Legal claims: Data is necessary to establish, exercise, or defend\n            legal claims.')}
          </li>
          <li>
            {t('yourExplicitRequestYouAskUsToRetainSpecificInformation', 'Your explicit request: You ask Us to retain specific information.')}
          </li>
          <li>
            {t('technicalLimitationsDataExistsInBackupSystemsThatAreScheduledForRoutineDeletion', 'Technical limitations: Data exists in backup systems that are\n            scheduled for routine deletion.')}
          </li>
        </ul>
        <p>
          {t('youMayRequestInformationAboutHowLongWeWillRetainYourPersonalDataByContactingUs', 'You may request information about how long We will retain Your\n          Personal Data by contacting Us.')}
        </p>
        <p>
          {t('whenRetentionPeriodsExpireWeSecurelyDeleteOrAnonymizePersonalDataAccordingToTheFollowingProcedures', 'When retention periods expire, We securely delete or anonymize\n          Personal Data according to the following procedures:')}
        </p>
        <ul>
          <li>
            {t('deletionPersonalDataIsRemovedFromOurSystemsAndNoLongerActivelyProcessed', 'Deletion: Personal Data is removed from Our systems and no longer\n            actively processed.')}
          </li>
          <li>
            {t('backupRetentionResidualCopiesMayRemainInEncryptedBackupsForALimitedPeriodConsistentWithOurBackupRetentionScheduleAndAreNotRestoredExceptWhereNecessaryForSecurityDisasterRecoveryOrLegalCompliance', 'Backup retention: Residual copies may remain in encrypted backups\n            for a limited period consistent with Our backup retention schedule\n            and are not restored except where necessary for security, disaster\n            recovery, or legal compliance.')}
          </li>
          <li>
            {t('anonymizationInSomeCasesWeConvertPersonalDataIntoAnonymousStatisticalDataThatCannotBeLinkedBackToYouThisAnonymizedDataMayBeRetainedIndefinitelyForResearchAndAnalytics', 'Anonymization: In some cases, We convert Personal Data into\n            anonymous statistical data that cannot be linked back to You. This\n            anonymized data may be retained indefinitely for research and\n            analytics.')}
          </li>
        </ul>
        <h3 id="privacy">{t('transferOfYourPersonalData', 'Transfer of Your Personal Data')}</h3>
        <p>
          {t('yourInformationIncludingPersonalDataIsProcessedAtTheCompanysOperatingOfficesAndInAnyOtherPlacesWhereThePartiesInvolvedInTheProcessingAreLocatedThisMeansThatThisInformationMayBeTransferredToAndMaintainedOnComputersLocatedOutsideOfYourStateProvinceCountryOrOtherGovernmentalJurisdictionWhereTheDataProtectionLawsMayDifferFromThoseOfYourJurisdiction', 'Your information, including Personal Data, is processed at the\n          Company\'s operating offices and in any other places where the parties\n          involved in the processing are located. This means that this\n          information may be transferred to — and maintained on — computers\n          located outside of Your state, province, country or other governmental\n          jurisdiction where the data protection laws may differ from those of\n          Your jurisdiction.')}
        </p>
        <p>
          {t('whereRequiredByApplicableLawWeWillEnsureThatInternationalTransfersOfYourPersonalDataAreSubjectToAppropriateSafeguardsAndWhereRelevantSupplementaryMeasuresTheCompanyWillTakeAllStepsReasonablyNecessaryToEnsureThatYourDataIsTreatedSecurelyAndInAccordanceWithThisPrivacyPolicyAndNoTransferOfYourPersonalDataWillTakePlaceToAnOrganizationOrACountryUnlessThereAreAdequateControlsInPlaceIncludingTheSecurityOfYourDataAndOtherPersonalInformation', 'Where required by applicable law, We will ensure that international\n          transfers of Your Personal Data are subject to appropriate safeguards\n          and, where relevant, supplementary measures. The Company will take all\n          steps reasonably necessary to ensure that Your data is treated\n          securely and in accordance with this Privacy Policy and no transfer of\n          Your Personal Data will take place to an organization or a country\n          unless there are adequate controls in place, including the security of\n          Your data and other personal information.')}
        </p>
        <h3 id="privacy">{t('deleteYourPersonalData', 'Delete Your Personal Data')}</h3>
        <p>
          {t('youHaveTheRightToDeleteOrRequestThatWeAssistInDeletingThePersonalDataThatWeHaveCollectedAboutYou', 'You have the right to delete or request that We assist in deleting the\n          Personal Data that We have collected about You.')}
        </p>
        <p>
          {t('ourServiceMayGiveYouTheAbilityToDeleteCertainInformationAboutYouFromWithinTheService', 'Our Service may give You the ability to delete certain information\n          about You from within the Service.')}
        </p>
        <p>
          {t('youMayUpdateAmendOrDeleteYourInformationAtAnyTimeBySigningInToYourAccountIfYouHaveOneAndVisitingTheAccountSettingsSectionThatAllowsYouToManageYourPersonalInformationYouMayAlsoContactUsToRequestAccessToCorrectOrDeleteAnyPersonalDataThatYouHaveProvidedToUs', 'You may update, amend, or delete Your information at any time by\n          signing in to Your Account, if You have one, and visiting the account\n          settings section that allows You to manage Your personal information.\n          You may also contact Us to request access to, correct, or delete any\n          Personal Data that You have provided to Us.')}
        </p>
        <p>
          {t('pleaseNoteHoweverThatWeMayNeedToRetainCertainInformationWhenWeHaveALegalObligationOrLawfulBasisToDoSo', 'Please note, however, that We may need to retain certain information\n          when We have a legal obligation or lawful basis to do so.')}
        </p>
        <h3 id="privacy">{t('disclosureOfYourPersonalData', 'Disclosure of Your Personal Data')}</h3>
        <h4 id="privacy">{t('businessTransactions', 'Business Transactions')}</h4>
        <p>
          {t('ifTheCompanyIsInvolvedInAMergerAcquisitionOrAssetSaleYourPersonalDataMayBeTransferredWeWillProvideNoticeBeforeYourPersonalDataIsTransferredAndBecomesSubjectToADifferentPrivacyPolicy', 'If the Company is involved in a merger, acquisition or asset sale,\n          Your Personal Data may be transferred. We will provide notice before\n          Your Personal Data is transferred and becomes subject to a different\n          Privacy Policy.')}
        </p>
        <h4 id="privacy">{t('lawEnforcement', 'Law Enforcement')}</h4>
        <p>
          {t('underCertainCircumstancesTheCompanyMayDiscloseYourPersonalDataIfRequiredToDoSoByLawOrInResponseToValidRequestsByPublicAuthoritiesEgACourtOrAGovernmentAgency', 'Under certain circumstances, the Company may disclose Your Personal\n          Data if required to do so by law or in response to valid requests by\n          public authorities (e.g. a court or a government agency).')}
        </p>
        <h4 id="privacy">{t('otherLegalRequirements', 'Other Legal Requirements')}</h4>
        <p>
          {t('theCompanyMayDiscloseYourPersonalDataInTheGoodfaithBeliefThatSuchActionIsNecessaryTo', 'The Company may disclose Your Personal Data in the good-faith belief\n          that such action is necessary to:')}
        </p>
        <ul>
          <li>{t('complyWithALegalObligation', 'Comply with a legal obligation')}</li>
          <li>{t('protectAndDefendTheRightsOrPropertyOfTheCompany', 'Protect and defend the rights or property of the Company')}</li>
          <li>
            {t('preventOrInvestigatePossibleWrongdoingInConnectionWithTheService', 'Prevent or investigate possible wrongdoing in connection with the\n            Service')}
          </li>
          <li>
            {t('protectThePersonalSafetyOfUsersOfTheServiceOrThePublic', 'Protect the personal safety of Users of the Service or the public')}
          </li>
          <li>{t('protectAgainstLegalLiability', 'Protect against legal liability')}</li>
        </ul>
        <h3 id="privacy">{t('securityOfYourPersonalData', 'Security of Your Personal Data')}</h3>
        <p>
          {t('theSecurityOfYourPersonalDataIsImportantToUsButRememberThatNoMethodOfTransmissionOverTheInternetOrMethodOfElectronicStorageIs100SecureWhileWeStriveToUseCommerciallyReasonableMeansToProtectYourPersonalDataWeCannotGuaranteeItsAbsoluteSecurity', 'The security of Your Personal Data is important to Us, but remember\n          that no method of transmission over the Internet, or method of\n          electronic storage, is 100% secure. While We strive to use\n          commercially reasonable means to protect Your Personal Data, We cannot\n          guarantee its absolute security.')}
        </p>
        <h2 id="privacy">{t('childrensAndMinorsPrivacy', 'Children\'s and Minors\' Privacy')}</h2>
        <p>
          {t('theServiceIsNotDirectedToAndWeDoNotKnowinglyCollectPersonalInformationFromAnyoneUnderTheAgeOf16', 'The Service is not directed to, and We do not knowingly collect\n          Personal Information from, anyone under the age of 16.')}
        </p>
        <p>
          {t('ifYouAreAParentOrGuardianAndYouBelieveYourChildHasProvidedUsWithPersonalInformationPleaseContactUsIfWeBecomeAwareThatWeHaveCollectedPersonalInformationFromAnyoneUnderTheAgeOf16WeWillTakeStepsToRemoveThatInformationFromOurServersAsSoonAsReasonablyPossible', 'If You are a parent or guardian and You believe Your child has\n          provided Us with Personal Information, please contact Us. If We become\n          aware that We have collected Personal Information from anyone under\n          the age of 16, We will take steps to remove that information from Our\n          servers as soon as reasonably possible.')}
        </p>
        <p>
          {t('someCountriesAndStatesSetAHigherAgeAtWhichAnIndividualCanConsentToTheProcessingOfTheirOwnPersonalInformationWhereWeRelyOnConsentAsALegalBasisAndTheLawApplicableToAUserSetsAnAgeHigherThan16WeMayRequireTheConsentOfThatUsersParentOrGuardianBeforeWeCollectAndUseTheirPersonalInformation', 'Some countries and states set a higher age at which an individual can\n          consent to the processing of their own Personal Information. Where We\n          rely on consent as a legal basis and the law applicable to a User sets\n          an age higher than 16, We may require the consent of that User\'s\n          parent or guardian before We collect and use their Personal\n          Information.')}
        </p>
        <h2 id="privacy">{t('linksToOtherWebsites', 'Links to Other Websites')}</h2>
        <p>
          {t('ourServiceMayContainLinksToOtherWebsitesThatAreNotOperatedByUsIfYouClickOnAThirdpartyLinkYouWillBeDirectedToThatThirdPartysSiteWeStronglyAdviseYouToReviewThePrivacyPolicyOfEverySiteYouVisit', 'Our Service may contain links to other websites that are not operated\n          by Us. If You click on a third-party link, You will be directed to\n          that third party\'s site. We strongly advise You to review the Privacy\n          Policy of every site You visit.')}
        </p>
        <p>
          {t('weHaveNoControlOverAndAssumeNoResponsibilityForTheContentPrivacyPoliciesOrPracticesOfAnyThirdpartySitesOrServices', 'We have no control over and assume no responsibility for the content,\n          privacy policies or practices of any third-party sites or services.')}
        </p>
        <h2 id="privacy">{t('changesToThisPrivacyPolicy', 'Changes to this Privacy Policy')}</h2>
        <p>
          {t('weMayUpdateOurPrivacyPolicyFromTimeToTimeWeWillNotifyYouOfAnyChangesByPostingTheNewPrivacyPolicyOnThisPage', 'We may update Our Privacy Policy from time to time. We will notify You\n          of any changes by posting the new Privacy Policy on this page.')}
        </p>
        <p>
          {t('weWillLetYouKnowViaEmailAndorAProminentNoticeOnOurServicePriorToTheChangeBecomingEffectiveAndUpdateTheQuotlastUpdatedquotDateAtTheTopOfThisPrivacyPolicy', 'We will let You know via email and/or a prominent notice on Our\n          Service, prior to the change becoming effective and update the\n          &quot;Last updated&quot; date at the top of this Privacy Policy.')}
        </p>
        <p>
          {t('youAreAdvisedToReviewThisPrivacyPolicyPeriodicallyForAnyChangesChangesToThisPrivacyPolicyAreEffectiveWhenTheyArePostedOnThisPage', 'You are advised to review this Privacy Policy periodically for any\n          changes. Changes to this Privacy Policy are effective when they are\n          posted on this page.')}
        </p>
        <h2 id="privacy">{t('contactUs', 'Contact Us')}</h2>
        <p>
          {t('ifYouHaveAnyQuestionsAboutThisPrivacyPolicyYouCanContactUs', 'If You have any questions about this Privacy Policy, You can contact\n          Us:')}
        </p>
        <ul>
          <li>
            {t('byVisitingThisPageOnOurWebsite', 'By visiting this page on Our Website:')}{" "}
            <a
              href={`${import.meta.env.VITE_API_URL}contact`}
              rel="external nofollow noopener"
              target="_blank"
            >
              {`${import.meta.env.VITE_API_URL}contact`}
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}
